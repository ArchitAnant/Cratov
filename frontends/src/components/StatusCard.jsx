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
  return (
    <div className="bg-white rounded-3xl shadow-md p-4 w-full max-w-sm flex flex-col gap-4">
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
      <p className="text-sm text-gray-700">{address}</p>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <p
          className={`text-xs font-medium ${
            status === "Approved" ? "text-green-600" : "text-red-500"
          }`}
        >
          {status === "Approved" ? "Approved" : "Awaiting Approval"}
        </p>

        <p className="text-xs font-medium text-orange-600">{bidStatus}</p>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === "Awaiting Approval" ? (
            <>
              <Phone size={16} />
              <p className="text-sm">{phoneCount}</p>
            </>
          ) : (
            <p className="text-sm font-semibold">₹{price} Cr</p>
          )}
        </div>

        <button className="flex items-center gap-2 bg-black text-white text-sm px-4 py-1.5 rounded-full hover:bg-gray-800">
          Expand <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default StatusCard;
