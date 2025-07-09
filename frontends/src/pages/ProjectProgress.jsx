import { Bookmark } from "lucide-react";

const ProjectProgress = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* ========= Left Section ========= */}
        <div className="flex-1">
          {/* 🔹 Title & Address */}
          <h2 className="text-[24px] font-semibold mb-2">Pothole Report</h2>
          <p className="text-[14px] text-gray-600">
            48, Thakurpukur, Bibirhat - Bakhrabat - Raipur Rd
          </p>

          {/*  Current Status */}
          <div className="mt-6 mb-6">
            <h4 className="text-[14px] text-gray-700 mb-2">Current Status :</h4>
            <ul className="text-[14px] space-y-1">
              <li className="text-green-700">• Approved</li>
              <li className="text-yellow-700">• Finished Bidding</li>
              <li className="text-red-700">• In Progress</li>
            </ul>
          </div>

          {/*  Images */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="w-[80px] h-[80px] bg-gray-200 rounded-[20px]"
              ></div>
            ))}
          </div>

          {/*  Appointed Contractor */}
          <div className="mt-4">
            <h4 className="text-[14px] text-gray-700 mb-2">Appointed to :</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              <p className="text-[14px] font-medium">₹1.50 Cr</p>
              <p className="text-[14px] font-normal">Spector Constructions</p>
            </div>
            <p className="text-[12px] text-gray-600 ml-5">⭐ 4.2/5.0</p>
          </div>
        </div>

        {/* ========= Right Section ========= */}
        <div className="w-full md:w-[30%] flex flex-col justify-between">
          <div>
            {/*  About Section */}
            <div className="flex items-center gap-2 mb-6">
              <Bookmark size={20} className="text-black" />
              <p className="text-[18px] font-semibold">About the post :</p>
            </div>

            <div className="space-y-4">
              {/*  Submitted By */}
              <div>
                <p className="text-[12px] text-gray-500 mb-1">Submitted By :</p>
                <div className="flex items-center gap-2">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="profile"
                    className="w-6 h-6 rounded-full"
                  />
                  <p className="text-[14px] font-medium">@ari_archit_</p>
                </div>
              </div>

              {/*  Submitted On */}
              <div>
                <p className="text-[12px] text-gray-500 mb-1">Submitted On :</p>
                <p className="text-[14px]">27th June 2025</p>
              </div>

              {/*  Pre-Repair Report */}
              <div>
                <p className="text-[12px] text-gray-500 mb-1">Pre-Repair Report :</p>
                <button
                  onClick={() => alert("Download started")}
                  className="text-[12px] text-blue-600 underline hover:text-blue-800"
                >
                  Download Pre-Repair Report
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProjectProgress;
