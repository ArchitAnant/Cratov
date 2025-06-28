import { Bookmark } from "lucide-react";

const ProjectProgress = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-8 px-8 py-10 bg-white">
      {/* Left Section */}
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Pothole Report
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          48, Thakurpukur, Bibirhat - Bakhrabat - Raipur Rd
        </p>

        {/* Status */}
        <div className="mt-4 mb-6">
          <h4 className="text-sm text-gray-700 mb-2">Current Status :</h4>
          <ul className="text-sm space-y-1">
            <li className="text-green-700">• Approved</li>
            <li className="text-yellow-700">• Finished Bidding</li>
            <li className="text-red-700">• In Progress</li>
          </ul>
        </div>

        {/* Images */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>

        {/* Appointed Contractor */}
        <div className="mt-4">
          <h4 className="text-sm text-gray-700 mb-2">Appointed to :</h4>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <p className="text-sm font-medium">
              ₹1.50 Cr <span className="font-normal ml-2">Spector Constructions</span>
            </p>
            <p className="text-xs text-gray-600">⭐ 4.2/5.0</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[30%] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold">About the post :</p>
            <Bookmark size={20} className="text-black" />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Submitted By :</p>
              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/100"
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-sm font-medium">ari_archit_</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Submitted On :</p>
              <p className="text-sm">27th June 2025</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Pre-Repair Report :</p>
              <a
                href="#"
                className="text-[12px] text-gray-600 underline hover:text-black"
              >
                Download Pre-Repair Report
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;
