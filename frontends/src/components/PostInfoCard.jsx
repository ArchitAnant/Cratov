import { Bookmark } from "lucide-react";

const PostInfoCard = ({
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
    <div className={`w-full lg:w-[300px] ${className}`}>
      {/* Header with Bookmark */}
      {showBookmark && (
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="text-black" />
          <h3 className="text-[18px] font-semibold">{title}</h3>
        </div>
      )}
      
      {!showBookmark && (
        <h3 className="text-[18px] font-semibold mb-4">{title}</h3>
      )}
      
      <div className="space-y-6">
        {/* Submitted By */}
        <div>
          <p className="text-gray-500 mb-1 text-[14px]">Submitted By :</p>
          <div className="flex items-center gap-2">
            <img
              src={submittedBy.avatar}
              alt="profile"
              className="w-7 h-7 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "https://i.ibb.co/Gt47sS0/avatar.png"; // Fallback image
              }}
            />
            <span className="font-medium text-[14px]">{submittedBy.name}</span>
          </div>
        </div>

        {/* Submitted On */}
        <div>
          <p className="text-gray-500 mb-1 text-[14px]">Submitted On :</p>
          <p className="font-medium text-[14px]">{submittedOn}</p>
        </div>

        {/* Pre-Repair Report Status */}
        <div>
          <p className="text-gray-500 mb-1 text-[14px]">Pre-Repair Report :</p>
          <p className="text-[12px] text-gray-500">{reportStatus}</p>
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

export default PostInfoCard;
