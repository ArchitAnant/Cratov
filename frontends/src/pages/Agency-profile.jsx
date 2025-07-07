import { Bookmark, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusCard from "../components/StatusCard";

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
            onClick={() => navigate("/reportissue")}
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
          display: "flex",
          gap: "32px",
        }}
      >
        <StatusCard
          username={"ari_archit_"}
          time={"2 days ago"}
          address={"48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd"}
          status={"Awaiting Approval"}
          bidStatus={""}
          voteCount={56}
          price={""}
        />
        <StatusCard
          username="ari_archit_"
          time="2 days ago"
          address="48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd"
          status="Approved"
          bidStatus="On Bid"
          price={1.5}
        />
      </div>
    </div>
  );
};

export default AgencyProfile;
