import { Bookmark, Phone, ArrowRight } from "lucide-react";

const StatusCard = ({
  username,
  time,
  address,
  status,
  bidStatus,
  phoneCount,
  price,
}) => {
  const isApproved = status === "Approved";

  return (
    <div
      className="bg-black bg-opacity-3 rounded-3xl shadow-md 
      w-[298px] h-[266px] flex flex-col justify-between 
      p-4 font-poppins ml-6"
    >
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
        <Bookmark className="text-black" size={18} />
      </div>

      {/* Address */}
      <p className="text-[13px] text-black">{address}</p>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <p
          className={`text-xs font-medium ${
            isApproved ? "text-green-600" : "text-red-500"
          }`}
        >
          {status}
        </p>
        {bidStatus && (
          <p className="text-xs font-medium text-orange-600">{bidStatus}</p>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        {/* Left Section */}
        {isApproved ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#D9D9D9]/50 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <p className="text-sm font-semibold">₹{price} Cr</p>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 
            bg-white/60 px-3 py-1 rounded-[12px] shadow-sm"
          >
            <Phone size={16} className="text-black" />
            <p className="text-sm text-black">{phoneCount}</p>
          </div>
        )}

        {/* Expand Button */}
        <button
          className="flex items-center justify-center gap-2 
          w-[137px] h-[40px] rounded-[49px] 
          bg-black text-white text-sm hover:bg-gray-800"
        >
          Expand <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default StatusCard;
