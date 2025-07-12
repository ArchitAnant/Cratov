
const BidStatus = ({ status }) => {
  return (
    <div className="flex flex-col gap-1 text-sm font-medium">
      {status === "Awaiting Approval" ? (
        <span className="text-xs font-medium text-[#9D0202]">
          • Awaiting Approval
        </span>
      ) : status === "On Bid" ? (
        <>
          <span className="text-xs font-medium text-[#2D6100]">
            • Approved
          </span>
          <span className="text-xs font-medium text-[#9D0202]">
            • On Bid
          </span>
        </>
      ) : (
        <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md w-fit">
          Unknown Status
        </span>
      )}
    </div>
  );
};

export default BidStatus;