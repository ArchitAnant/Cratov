import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GuideLineBar from "../components/Action";

const Verify = () => {
  const [progress, setProgress] = useState(10);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState("Uploading");
  const [loadingBarColor, setLoadingBarColor] = useState("bg-black");

  const handlePost = () => {
    setUploading(true);
    setProgress(10);

    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if(prev>=40){
          setLoadingText("Validating");
        }
        if (prev === 100) {
          clearInterval(uploadInterval);
          setUploading(false);
          setLoadingText("Completed");
          setLoadingBarColor("bg-[#2D6100]");
          // navigate("/status");
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div
      className="font-poppins flex flex-col md:flex-row gap-8 pt-24 mb-10 min-h-screen bg-white"
    >
      {/* ✅ Left Section with 86px padding */}
      <div className="flex-1 pl-[86px]">
        <h2 className="text-[30px] font-medium mb-[50px] leading-[100%] text-black">
          Report A Pothole
        </h2>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[18px] opacity-50">{loadingText}</p>
          <Bookmark size={20} className="text-black" />
        </div>

        {/* Upload Progress */}
        <div className="w-full bg-gray-200 rounded-full h-7">
          <div
            className={`${loadingBarColor} h-7 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* ✅ Right Section */}
      <GuideLineBar
        onActionButtonClick={handlePost}
        actionButtonText="Post"
        buttonDisable={uploading}
      />
    </div>
  );
};

export default Verify;
