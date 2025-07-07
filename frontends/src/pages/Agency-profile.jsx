import { Bookmark, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgencyProfile = () => {
  const navigate = useNavigate();
  return (
    <div className="font-poppins px-8 py-20 min-h-screen bg-white">
      {/* Profile Header */}
      <div
        className="flex flex-col md:flex-row justify-between mb-12"
        style={{ position: "relative" }}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-[26px] md:text-[30px] font-medium text-black">
            Profile
          </h2>
          <div className="flex items-center gap-5">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-black">Agency Name</h3>
              <p className="text-sm text-gray-600">agency_name4kc004r</p>
              <p className="text-sm text-gray-800">Agency</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex flex-col gap-4 items-start md:items-end"
          style={{
            position: "absolute",
            top: 50,
            right: 0,
            width: 180,
            height: 48,
            opacity: 1,
            zIndex: 2,
            left: 846,
          }}
        >
          <button className="flex items-center gap-2 text-sm text-black hover:underline bg-gray-100 w-full h-12 rounded-xl shadow-md px-4">
            <span className="text-lg">✏️</span> Edit Profile
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-black hover:underline bg-gray-100 w-full h-12 rounded-xl shadow-md px-4"
          >
            <span className="text-lg">➕</span> Add Pothole
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 text-sm">
        <button className="font-medium text-black border-b-2 border-black pb-1">
          Verified
        </button>
        <button className="text-gray-500">Saved</button>
      </div>

      {/* Cards */}
      <div
        style={{
          position: "relative",
          minHeight: "300px",
          marginTop: "40px",
        }}
      >
        {[1, 2].map((item, idx) => (
          <div
            key={item}
            className="rounded-[49px] bg-gray-100 px-6 py-5 space-y-4"
            style={{
              width: 298,
              height: 266,
              position: "absolute",
              top: 0,
              left: idx === 0 ? 0 : 330,
              opacity: 1,
              borderRadius: 49,
              boxShadow: "0 1px 4px rgba(19, 18, 18, 0.04)",
              background: "#f3f4f6",
              zIndex: 1,
              color: "#fff",
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                  alt="user"
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <p className="text-sm text-black font-medium">
                    ari_archit_
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <Bookmark size={18} className="text-gray-700 cursor-pointer" />
            </div>
            <p className="text-sm text-gray-700 leading-tight">
              48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd
            </p>
            <div>
              {item === 1 ? (
                <p className="text-xs text-red-500 font-medium">
                  Awaiting Approval
                </p>
              ) : (
                <>
                  <p className="text-xs text-green-600 font-medium">Approved</p>
                  <p className="text-xs text-yellow-500 font-medium">On Bid</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {item === 1 ? (
                <p className="text-black font-semibold">📞 56</p>
              ) : (
                <>
                  <div className="w-6 h-6 bg-[#D9D9D9]/50 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <p className="text-black font-semibold">₹1.50 Cr</p>
                </>
              )}
              <button
                className="flex items-center justify-center gap-6 
                w-[137px] h-[40px] rounded-[49px] 
                bg-black text-white text-sm hover:bg-gray-800"
              >
                Expand <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencyProfile;
