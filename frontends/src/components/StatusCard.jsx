import { Bookmark, CornerLeftUp } from "lucide-react";
import { ActionButton } from "./Action";

const StatusCard = ({
  username,
  time,
  address,
  status,
  bidStatus,
  voteCount,
  price,
  userType = "user",
  onExpand = () => {},
  showBookmark = true
}) => {
  const isApproved = status === "Approved";

  return (
    <div className="bg-black bg-opacity-[0.03] rounded-[50px] w-[338px] h-[326px] flex flex-col justify-between pt-9 px-9 pb-5 font-poppins">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{username}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        {showBookmark && <Bookmark className="text-black" size={18} />}
      </div>

      {/* Address */}
      <p className="text-[13px] text-black">{address}</p>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <p className={`text-xs font-medium ${isApproved ? "text-green-600" : "text-red-500"}`}>
          {status}
        </p>
        {bidStatus && (
          <p className="text-xs font-medium text-orange-600">{bidStatus}</p>
        )}
      </div>

      {/* Bottom Section - Show for both user and agency */}
      <div className="flex items-center justify-between">
        {/* Left Section - Show arrow icon OR rupees based on data */}

        {/* Show arrow icon + vote count when no price (for both user and agency) */}
        {!price && (
          <div className="flex flex-row justify-center items-center gap-2 bg-white p-4 w-[100px] rounded-full">
            <CornerLeftUp size={16} className="text-black" />
            <p className="text-sm text-black">{voteCount || 0}</p>
          </div>
        )}

        {/* Show rupees when price exists (for both user and agency) */}
        {price && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#D9D9D9]/50 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <p className="text-sm font-semibold">₹{price} Cr</p>
          </div>
        )}

        {/* Always show Expand button for both user and agency */}
        <ActionButton
          onClick={onExpand}
          action="Expand"
          ifDisable={false}
        />
      </div>
    </div>
  );
};



export default StatusCard;
