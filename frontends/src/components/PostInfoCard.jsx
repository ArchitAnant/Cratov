import { Bookmark } from "lucide-react";

const PostPageInfoCard = ({
  title = "About the post :",
  submittedBy = {
    name: "ari_archit_",
    avatar: "https://i.ibb.co/Gt47sS0/avatar.png"
  },
  submittedOn = "27th June 2025",
  reportStatus = "Pre-Repair Report is awaiting the Approval",
  showBookmark = true,
  children, // For additional content like buttons
  className = ""
}) => {
  return (
    <div className={`fixed right-0 h-full w-full md:w-[30%] pr-[86px] me-5 overflow-y-auto ${className}`}>
      {/* Header with Bookmark */}
      {/* {showBookmark && (
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="text-black" />
          <h3 className="text-[18px] font-semibold">{title}</h3>
        </div>
      )} */}
      
      {/* {!showBookmark && ( */}
        <h3 className="text-[18px] font-medium mb-10">{title}</h3>
      {/* )} */}
      
      <div className="space-y-6">
        {/* Submitted By */}
        <div>
          <p className="text-black font-medium text-opacity-70 mb-5 text-[12px]">Submitted By :</p>
          <div className="flex items-center gap-3">
            <img
              src={submittedBy.avatar}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "https://i.ibb.co/Gt47sS0/avatar.png"; // Fallback image
              }}
            />
            <span className="font-medium text-[14px]">{submittedBy.name}</span>
          </div>
        </div>

        {/* Submitted On */}
        <div className="pb-6">
          <p className="text-black font-medium text-opacity-70 mb-5 text-[12px]">Submitted On :</p>
          <p className="font-medium text-[14px]">{submittedOn}</p>
        </div>

        {/* Pre-Repair Report Status */}
        <div>
          <p className="text-black font-medium text-opacity-70 mb-3 text-[12px]">Pre-Repair Report :</p>
          <p className="text-[10px] text-black text-opacity-70">{reportStatus}</p>
        </div>

        {/* Additional Content (Buttons, etc.) */}
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPageInfoCard;
