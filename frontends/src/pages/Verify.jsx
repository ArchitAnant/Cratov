import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react";
import { useUpload } from "../context/UploadContext";
import { useLogin } from "../context/LoginContext";
import {GuideLineBar} from "../components/Action";
import {createImageUploadPayload,uploadPostToBackend,predictPotholes,checkAcceptance} from "../helper"; // Import the helper function
import { savePostId, addSmallPost } from "../context/post";
import VerificationStatusCard from "../components/VerificationStatusCard";

const Verify = () => {
  const [progress, setProgress] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("Waiting");
  const [barColor, setBarColor] = useState("bg-black");
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();
  const locationState = useLocation();
  const upload  = useUpload();
  const { userType, userName, userUsername, userAddress } = useLogin();

  // Check navigation state first, then fallback to LoginContext
  // Also check if we came from agency flow
  const referrer = document.referrer;
  const cameFromAgencyFlow = referrer.includes('/agency-profile') || locationState.state?.userType === "agency";

  let currentUserType = locationState.state?.userType || userType;

  // Override if we came from agency flow
  if (cameFromAgencyFlow && currentUserType !== "agency") {
    currentUserType = "agency";
  }

  const isAgency = currentUserType === "agency";

  const handlePost = async () => {

    setUploading(true);
    setProgress(10);
    setStatus("Uploading");
    setBarColor("bg-black");
    setShowResult(false);
    try {
      // Use userUsername if available, otherwise fallback to userName or userAddress
      const userId = userUsername || userName || userAddress || "anonymous_user";
      const payload = await createImageUploadPayload(upload.images, userId, upload.stringLandmark, upload.location);
      const postid_json = await uploadPostToBackend(payload);
      setProgress(50);
      setStatus("Validating");
      var post_id = postid_json.postID;
      // Save post ID for later use
      savePostId(post_id);

      // Add small post to local list
      addSmallPost({
        postID: post_id,
        username: userUsername || userName || "Anonymous",
        address: upload.stringLandmark || "Location not specified",
        status: "Processing...",
        timestamp: new Date().toISOString(),
        voteCount: 0
      });

      const response = await predictPotholes(post_id);
      var value = checkAcceptance(response);
      setProgress(100);
      setShowResult(true);
      setUploading(false);
      if (value === 1) {
        setStatus("Accepted");
        setBarColor("bg-[#2D6100]");
      } else {
        setBarColor("bg-[#9D0202]");
        setStatus("Rejected");
      }
      // No redirect now
    } catch (err) {
      setStatus("Error: " + (err.response?.data?.error || err.message));
      setBarColor("bg-[#9D0202]");
      setUploading(false);
      setShowResult(true);
    }
  };

  const handlePostButton = async () => {
    try {
      // Clear uploaded data from context
      upload.setImages([null,null,null,null]);
      upload.setStringLandmark("");
      upload.setLocation(null);

      // Update session storage for proper navigation state
      sessionStorage.setItem('lastProfileType', currentUserType);

      // Navigate to home page directly
      navigate("/", { state: { userType: currentUserType } });

    } catch (error) {
      console.error("Error in handlePostButton:", error);
      // Just log the error, no alert message
    }
  };

  // call the handlePost function when the page loads
const hasPostedRef = useRef(false);

useEffect(() => {
  if (!hasPostedRef.current && upload.images.length > 0) {
    handlePost();
    hasPostedRef.current = true;
  } else if (!hasPostedRef.current && upload.images.length === 0) {
    navigate("/reportissue");
    hasPostedRef.current = true;
  }
}, [upload.images, navigate]);

  return (
    <div className="font-poppins flex flex-col md:flex-row gap-8 pt-10 pb-10 min-h-screen bg-white">
      {/* Left Section */}
      <div className="flex-1 pl-[86px]">
        <VerificationStatusCard
          title={isAgency ? "Verify Pothole Report" : "Report A Pothole"}
          status={status}
          barColor={barColor}
          progress={progress}
          showResult={showResult}
          resultMessages={showResult && (
            <>
              {status === "Accepted" && (
                <div>
                  <span className="text-[#2D6100] font-medium text-sm">Accepted</span>
                  <h1 className="opacity-50">The post will be verified by Officials.</h1>
                  <h1 className="opacity-50">After the Officials have verified the post it will be up for bidding.</h1>
                </div>
              )}
              {status === "Rejected" && (
                <div>
                  <span className="text-[#9D0202] font-medium text-sm">Rejected</span>
                  <h1 className="opacity-50">Make sure the images contain a pothole.</h1>
                </div>
              )}
              {status.startsWith("Error") && <span className="text-red-600">{status}</span>}
            </>
          )}
        />
      </div>
      {/* Right Section */}
      <GuideLineBar actionButtonText={isAgency ? "Verify" : "Post"} buttonDisable={uploading} onActionButtonClick={handlePostButton} />
    </div>
  );
};

export default Verify;
