import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";

const Verify = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("Waiting");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [barColor, setBarColor] = useState("bg-black");
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handlePost = async () => {
    if (selectedFiles.length !== 4) {
      setStatus("Please select 4 images");
      return;
    }
    setUploading(true);
    setProgress(0);
    setStatus("Uploading");
    setBarColor("bg-black");
    setShowResult(false);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));
      formData.append("userId", "testuser"); // Replace with actual userId
      // formData.append("tableName", "posts"); // Optional
      // Replace with Azure backend endpoint
      const azureUrl = `https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/verify-pothole?code=AZURE_FUNCTION_KEY`;
      const response = await axios.post(azureUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });
      setStatus(response.data.status);
      setProgress(100);
      setShowResult(true);
      if (response.data.status === "Accepted") {
        setBarColor("bg-green-500");
      } else {
        setBarColor("bg-red-500");
      }
      // No redirect now
    } catch (err) {
      setStatus("Error: " + (err.response?.data?.error || err.message));
      setBarColor("bg-red-500");
      setUploading(false);
      setShowResult(true);
    }
  };

  return (
    <div className="font-poppins flex flex-col md:flex-row gap-8 pt-24 pb-10 min-h-screen bg-white">
      {/* Left Section */}
      <div className="flex-1 pl-[86px]">
        <h2 className="text-[30px] font-medium mb-8 leading-[100%] text-black">
          Report A Pothole
        </h2>
        <div className="flex items-center justify-between mb-6">
          <p className="text-[18px] opacity-80">{status}</p>
          <Bookmark size={20} className="text-black" />
        </div>
        {/* Upload Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${barColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {/* Show result text if upload is done */}
        {showResult && (
          <div className="mt-4 text-lg font-semibold">
            {status === "Accepted" && <span className="text-green-600">Accepted</span>}
            {status === "Rejected" && <span className="text-red-600">Rejected</span>}
            {status.startsWith("Error") && <span className="text-red-600">{status}</span>}
          </div>
        )}
        {/* Image Upload Input */}
        <div className="mt-6">
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading}
          />
          <p className="text-xs mt-2 text-gray-500">Select 4 images to upload</p>
        </div>
      </div>
      {/* Right Section */}
      <div className="w-full md:w-[30%] pr-[86px] flex flex-col justify-between">
        <div>
          {/* Guidelines */}
          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-2">Guidelines :</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Add the location properly</li>
              <li>Make sure the images are clear and show the entire potholes</li>
              <li>You need to upload all 4 images.</li>
            </ul>
          </div>
          {/* Cautions */}
          <div className="mb-10">
            <h4 className="font-semibold text-lg mb-2">Cautions :</h4>
            <p className="text-sm text-gray-700">
              Don’t upload unwanted images or misleading information. Uploading
              such images would lead to account termination.
            </p>
          </div>
        </div>
        {/* Post Button */}
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
