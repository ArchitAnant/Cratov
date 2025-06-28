import { Bookmark, Phone } from "lucide-react";

const PostDetail = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-[24px] font-semibold mb-2">Pothole Report</h2>
          <p className="text-[14px] text-gray-600 mb-4">
            48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd
          </p>

          {/* Current Status */}
          <div className="mb-4">
            <p className="text-[14px] text-gray-700">Current Status :</p>
            <p className="text-[12px] text-red-500 font-medium">
              • Awaiting Approval
            </p>
          </div>

          {/* Image Gallery */}
          <div className="flex gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[80px] h-[80px] bg-gray-200 rounded-[20px]"
              ></div>
            ))}
          </div>

          {/*  Upvote Section Fixed */}
          <div className="flex items-center gap-4">
            <button
              className="flex items-center justify-center gap-2 
                w-[146px] h-[56px] rounded-[49px] 
                bg-[#D9D9D9] 
                text-black 
                hover:bg-gray-300"
            >
              <Phone size={18} />
              <span className="text-[16px] font-medium">Upvote</span>
            </button>
            <p className="text-[16px] font-medium">56</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[30%] flex flex-col gap-4">
          {/*  Bookmark + About Heading */}
          <div className="flex items-center gap-2">
            <Bookmark className="text-black" />
            <h4 className="text-[18px] font-semibold">About the post :</h4>
          </div>

          <div className="mt-2">
            <div className="text-[14px] space-y-6">
              {/* Submitted By */}
              <div>
                <p className="text-gray-500 mb-1">Submitted By :</p>
                <div className="flex items-center gap-2">
                  <img
                    src="https://i.ibb.co/Gt47sS0/avatar.png"
                    alt="profile"
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="font-medium">ari_archit_</span>
                </div>
              </div>

              {/* Submitted On */}
              <div>
                <p className="text-gray-500 mb-1">Submitted On :</p>
                <p className="font-medium">27th June 2025</p>
              </div>

              {/* Pre-Repair Report */}
              <div>
                <p className="text-gray-500 mb-1">Pre-Repair Report :</p>
                <p className="text-[12px] text-gray-500">
                  Pre-Repair Report is awaiting the Approval
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
