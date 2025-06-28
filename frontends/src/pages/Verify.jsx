import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Simulate progress bar
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 10), 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handlePost = () => {
    navigate("/status"); // Next page route
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 px-8 py-10 min-h-screen bg-white">
      {/* Left Section */}
      <div className="flex-1">
        <h2 className="text-3xl font-semibold mb-6">Report A Pothole</h2>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">Uploading</p>
          <Bookmark size={20} className="text-black" />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-black h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[30%] flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-2">Guidelines :</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Add the location properly</li>
              <li>
                Make sure the images are clear and show the entire potholes
              </li>
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

        {/* Post Button */}
        <button
          onClick={handlePost}
          disabled={progress < 100}
          className={`flex items-center gap-2 px-6 py-2 rounded-full ${
            progress === 100
              ? "bg-black hover:bg-gray-800 text-white cursor-pointer"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Post <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default Verify;
