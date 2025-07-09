import { Bookmark, Star } from "lucide-react";

const BiddingDetail = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* ========= Left Section ========= */}
        <div className="flex-1">
          {/*  Title & Address */}
          <div>
            <h1 className="text-[24px] font-semibold mb-1">
              Pothole Report
            </h1>
            <p className="text-[14px] text-gray-600">
              48, Thakurpukur, Bibirhat - Bakrahat – Raipur Rd
            </p>
          </div>

          {/*  Current Status */}
          <div className="mt-6 mb-4">
            <h3 className="text-[14px] font-medium mb-2">Current Status :</h3>
            <ul className="list-disc ml-5 text-[14px] space-y-1">
              <li className="text-green-600">Approved</li>
              <li className="text-red-500">On Bid</li>
            </ul>
          </div>

          {/*  Images */}
          <div className="flex gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-[80px] h-[80px] bg-gray-200 rounded-[20px]"
              />
            ))}
          </div>

          {/*  Current Bidding */}
          <div>
            <h3 className="text-[14px] font-medium mb-2 text-[#D9D9D9]">
              Current Bidding :
            </h3>

            <div className="flex flex-col gap-1 ml-2">
              {/*  ₹1.50 Cr with Dot */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#D9D9D9] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                </div>
                <p className="font-semibold text-[18px]">₹1.50 Cr</p>
              </div>

              {/*  Spector and Rating */}
              <p className="text-[14px] text-gray-600">Spector Constructions</p>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-[#D9D9D9]" />
                <span className="text-[14px] text-[#9A9A9A]">4.2/5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========= Right Sidebar ========= */}
        <div className="w-full md:w-[30%] flex flex-col gap-6">
          {/*  Bookmark + About */}
          <div className="flex items-center gap-2">
            <Bookmark className="text-black" />
            <h4 className="text-[18px] font-semibold">About the post :</h4>
          </div>

          {/*  Submitted By */}
          <div>
            <p className="text-[14px] text-gray-500 mb-1">Submitted By :</p>
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-[30px] h-[30px] rounded-full"
              />
              <span className="font-medium">@ari_archit_</span>
            </div>
          </div>

          {/*  Submitted On */}
          <div>
            <p className="text-[14px] text-gray-500 mb-1">Submitted On :</p>
            <p className="text-[14px] font-medium">27th June 2025</p>
          </div>

          {/*  Pre-Repair Report */}
          <div>
            <p className="text-[14px] text-gray-500 mb-1">Pre-Repair Report :</p>
            <button
              onClick={() => alert("Download started")}
              className="text-blue-600 underline hover:text-blue-800 text-[14px]"
            >
              Download Pre-Repair Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingDetail;
