import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useUpload } from "../context/UploadContext";
import {GuideLineBar} from "../components/Action";
import {createImageUploadPayload,uploadPostToBackend,predictPotholes,checkAcceptance} from "../helper"; // Import the helper function

const Verify = () => {
  const [progress, setProgress] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("Waiting");
  const [barColor, setBarColor] = useState("bg-black");
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();
  const upload  = useUpload();


  const handlePost = async () => {

    setUploading(true);
    setProgress(10);
    setStatus("Uploading");
    setBarColor("bg-black");
    setShowResult(false);
    try {
      console.log("Uploading images...");
      const payload = await createImageUploadPayload(upload.images, "testuser",upload.stringLandmark,upload.location);
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
        <h2 className="text-[30px] font-medium mb-8 leading-[100%] text-black">
          Report A Pothole
        </h2>
        <div className="flex w-full lg:max-w-[800px] max-w-[200px] items-center justify-between mb-6">
          <p className="text-[18px] opacity-80">{status}</p>
          <Bookmark size={20} className="text-black" />
        </div>
        {/* Upload Progress Bar */}
        <div className="w-full lg:max-w-[800px] max-w-[200px bg-gray-200 rounded-full h-7">
          <div
            className={`${barColor} h-7 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {/* Show result text if upload is done */}
        {showResult && (
          <div className="mt-10 text-lg ">
            {status === "Accepted" && 
            <div>
              <span className="text-[#2D6100] font-medium text-sm">Accepted</span>
              <h1 className="opacity-50">The post will be verified by Officials.</h1>
              <h1 className="opacity-50">After the Officials have verified the post it will be up for bidding.</h1>
            </div>
            }
            {status === "Rejected" && 
            <div>
              <span className="text-[#9D0202] font-medium text-sm">Rejected</span>
              <h1 className="opacity-50">Make sure the images contain a pothole.</h1>
            </div>
            }
            {status.startsWith("Error") && <span className="text-red-600">{status}</span>}
          </div>
        )}

      </div>
      {/* Right Section */}
      <GuideLineBar  actionButtonText={"Post"} buttonDisable={uploading} onActionButtonClick={() => navigate("/postdetail")} />
    </div>
  );
};

export default Verify;
