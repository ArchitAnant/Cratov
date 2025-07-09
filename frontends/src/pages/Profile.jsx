import { useNavigate } from "react-router-dom";
import StatusCard from "../components/StatusCard";
import UserProfileCard from "../components/UserProfileCard";
import { useLogin } from "../context/LoginContext";

const Profile = () => {
  const navigate = useNavigate();
  const { userType } = useLogin();

  return (
    <div className="font-poppins px-8 py-8 min-h-screen bg-white">
      {/* Profile Header */}
      <UserProfileCard
        name="Archit Anant"
        username="ari_archit_"
        userType="User"
        votesLeft={8}
        showVotes={true}
        onEditProfile={() => {}}
        onAddPothole={() => {
          sessionStorage.setItem('lastProfileType', 'user');
          navigate("/reportissue", { state: { userType: "user" } });
        }}
      />

      {/* Tabs */}
      <div className="flex gap-6 mb-8 text-sm">
        <button className="font-medium text-black border-b-2 border-black pb-1">
          Uploaded
        </button>
        <button className="text-gray-500">Upvoted</button>
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
          userType="user"
          onExpand={() => {
            console.log("Profile - Navigating to PostDetail with userType: user");
            navigate("/postdetail", { state: { userType: "user" } });
          }}
        />
        <StatusCard
          username="ari_archit_"
          time="2 days ago"
          address="48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd"
          status="Approved"
          bidStatus="On Bid"
          price={1.5}
          userType="user"
          onExpand={() => {
            console.log("Profile - Navigating to PostDetail with userType: user");
            navigate("/postdetail", { state: { userType: "user" } });
          }}
        />
      </div>
    </div>
  );
};

export default Profile;
