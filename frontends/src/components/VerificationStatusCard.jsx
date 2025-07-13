import React from "react";
import { Bookmark } from "lucide-react";

const VerificationStatusCard = ({
  title = "Report A Pothole",
  status,
  barColor,
  progress,
  showResult,
  resultMessages,
}) => {
  return (
    <div>
      <h2 className="text-[30px] font-medium mb-8 leading-[100%] text-black">
        {title}
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
        <div className="mt-10 text-lg ">{resultMessages}</div>
      )}
    </div>
  );
};

export default VerificationStatusCard;
