import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react";
import { useUpload } from "../context/UploadContext";
import { useLogin } from "../context/LoginContext";
import {GuideLineBar} from "../components/Action";
import {createImageUploadPayload,uploadPostToBackend,predictPotholes,checkAcceptance,addRoadCondition} from "../helper"; // Import the helper function
import { savePostData, fileToBase64 } from "../context/post";
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
  const { userName,userType } = useLogin();

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
      console.log("Uploading images...");
      const payload = await createImageUploadPayload(upload.images, userName,upload.stringLandmark,upload.location);
      console.log("Payload created..");
      const postid_json = await uploadPostToBackend(payload);
      setProgress(50);
      setStatus("Validating");
      console.log("Post ID received");
      var post_id = postid_json.postID;
      const response = await predictPotholes(post_id);
      var value = checkAcceptance(response)
      console.log("Prediction response..");
      setProgress(100);
      setShowResult(true);
      setUploading(false);
      if (value[0] === 1) {
        console.log("value[1] is: ", value[1]);
        console.log("Post ID is: ", post_id);
        upload.setRoadCondition(value[1]);
        addRoadCondition(post_id, value[1]);
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
    // Convert images to base64
    const base64Images = await Promise.all(upload.images.map(img => img ? fileToBase64(img) : ""));
    // savePostData({
    //   address: upload.stringLandmark,
    //   images: base64Images,
    //   userType: currentUserType
    // });
    upload.setImages([null,null,null,null])

    navigate("/postdetail", { state: { userType: currentUserType } });
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
