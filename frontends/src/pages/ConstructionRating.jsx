import { useState } from "react";
import { Bookmark, Star } from "lucide-react";

const ConstructionRating = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen bg-white py-10 px-[86px] mt-20 font-poppins text-gray-800">
      <div className="max-w-[95rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-6">

        {/* ========= Left Section ========= */}
        <div className="md:col-span-2 space-y-6">
          {/*  Title & Address */}
          <div>
            <h1 className="text-2xl font-semibold">Pothole Report</h1>
            <p className="text-gray-600 mt-1">
              48, Thakurpukur, Bibirhat - Bakrahat – Raipur Rd
            </p>
          </div>

          {/*  Current Status */}
          <div>
            <h3 className="text-sm font-medium">Current Status :</h3>
            <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
              <li className="text-green-600">Approved</li>
              <li className="text-green-600">Finished Bidding</li>
              <li className="text-green-600">Finished Construction</li>
              <li className="text-green-600">Funded</li>
            </ul>
          </div>

          {/*  Contractor Info */}
          <div>
            <h3 className="text-sm font-medium mb-2">Appointed to :</h3>
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-black rounded-full inline-block" />
              <p className="text-lg font-semibold">₹1.50 Cr</p>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                Spector Constructions
                <Star size={14} className="text-yellow-500" />
                4.2/5.0
              </p>
            </div>
          </div>

          {/*  Rating Section */}
          <div>
            <p className="text-sm font-medium mb-2">Rate the construction :</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`cursor-pointer ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  fill={star <= rating ? "#FACC15" : "none"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ========= Right Section ========= */}
        <div className="space-y-6 text-sm">
          <div className="flex items-center gap-2">
            <Bookmark size={18} />
            <h4 className="text-base font-semibold">About the post :</h4>
          </div>

          <div>
            <p className="text-gray-500">Submitted By :</p>
            <div className="flex items-center mt-1 gap-2">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=archit"
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">@ari_archit_</span>
            </div>
          </div>

          <div>
            <p className="text-gray-500">Submitted On :</p>
            <p className="font-medium mt-1">27th June 2025</p>
          </div>

          <div>
            <p className="text-gray-500">Pre-Repair Report :</p>
            <button
              onClick={() => alert("Download started")}
              className="text-blue-600 underline hover:text-blue-800 mt-1 inline-block"
            >
              Download Pre-Repair Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionRating;
