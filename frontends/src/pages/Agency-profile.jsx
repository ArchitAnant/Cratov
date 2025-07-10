import { useNavigate } from "react-router-dom";
import UserProfileCard from "../components/UserProfileCard";
import StatusCard from "../components/StatusCard";

const AgencyProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="font-poppins px-8 py-20 min-h-screen bg-white">
      {/* Profile Header */}
      <UserProfileCard
        name="Agency Name"
        username="agency_name4kc004r"
        userType="Agency"
        showVotes={false}
        onEditProfile={() => {}}
        // Removed onAddPothole prop
      />

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
          userType="agency"
          onExpand={() => {
            console.log("Agency-profile - Navigating to PostDetail with userType: agency");
            navigate("/postdetail", { state: { userType: "agency" } });
          }}
        />
        <StatusCard
          username="ari_archit_"
          time="2 days ago"
          address="48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd"
          status="Approved"
          bidStatus="On Bid"
          price={1.5}
          userType="agency"
          onExpand={() => {
            console.log("Agency-profile - Navigating to PostDetail with userType: agency");
            navigate("/postdetail", { state: { userType: "agency" } });
          }}
        />
      </div>
    </div>
  );
};

export default AgencyProfile;
