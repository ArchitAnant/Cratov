import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handlePost = () => {
    setUploading(true);
    setProgress(0);

    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 50) {
          clearInterval(uploadInterval);
          navigate("/status");
          return 50;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div
      className="font-poppins flex flex-col md:flex-row gap-8 pt-24 pb-10 min-h-screen bg-white"
    >
      {/* ✅ Left Section with 86px padding */}
      <div className="flex-1 pl-[86px]">
        <h2 className="text-[30px] font-medium mb-8 leading-[100%] text-black">
          Report A Pothole
        </h2>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[18px] opacity-80">Uploading</p>
          <Bookmark size={20} className="text-black" />
        </div>

        {/* Upload Progress */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-black h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* ✅ Right Section */}
      <div className="w-full md:w-[30%] pr-[86px] flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-2">Guidelines :</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Add the location properly</li>
              <li>Make sure the images are clear and show the entire potholes</li>
              <li>You need to upload all 4 images.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h4 className="font-semibold text-lg mb-2">Cautions :</h4>
            <p className="text-sm text-gray-700">
              Don’t upload unwanted images or misleading information. Uploading
              such images would lead to account termination.
            </p>
          </div>
        </div>

        {/* ✅ Post Button */}
        <button
          onClick={handlePost}
          disabled={uploading}
          className={`flex items-center justify-center gap-2 
            w-[137px] h-[40px] rounded-[49px] 
            text-base
            ${
              uploading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black hover:bg-gray-800 text-white cursor-pointer"
            }`}
        >
          Post <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default Verify;
