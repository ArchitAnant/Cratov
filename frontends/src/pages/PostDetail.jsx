import { Bookmark, Phone } from "lucide-react";

const PostDetail = () => {
  return (
    <div className="min-h-screen bg-white px-8 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">Pothole Report</h2>
          <p className="text-sm text-gray-600 mb-4">
            48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd
          </p>

          <div className="mb-4">
            <p className="text-sm text-gray-700">Current Status :</p>
            <p className="text-xs text-red-500 font-medium">
              • Awaiting Approval
            </p>
          </div>

          {/* Image Gallery */}
          <div className="flex gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-200 rounded-lg"
              ></div>
            ))}
          </div>

          {/* Upvote Section */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800">
              <Phone size={16} />
              Upvote
            </button>
            <p className="text-sm">56</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[30%] flex flex-col gap-4">
          <div className="flex justify-end">
            <Bookmark className="text-black" />
          </div>

          <div>
            <h4 className="text-md font-semibold mb-2">About the post :</h4>

            <div className="text-sm space-y-2">
              <p>
                <span className="text-gray-500">Submitted By :</span>{" "}
                <span className="font-medium">ar1_archit_</span>
              </p>
              <p>
                <span className="text-gray-500">Submitted On :</span>{" "}
                27th June 2025
              </p>
              <p>
                <span className="text-gray-500">Pre-Repair Report :</span>
                <br />
                <span className="text-xs">
                  Pre-Repair Report is awaiting the approval
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
