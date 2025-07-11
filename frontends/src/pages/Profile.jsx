import { useNavigate } from "react-router-dom";
import StatusCard from "../components/StatusCard";
import UserProfileCard from "../components/UserProfileCard";
import { useLogin } from "../context/LoginContext";
import { savePostData } from "../context/post";

const Profile = () => {
  const navigate = useNavigate();
  const { userType, userName, userUsername } = useLogin();

  return (
    <div className="font-poppins px-8 py-8 min-h-screen bg-white">
      <UserProfileCard
        name={userName}
        username={userUsername}
        userType={userType}
        votesLeft={8}
        showVotes={true}
        onEditProfile={() => {}}
        onAddPothole={() => {
          sessionStorage.setItem('lastProfileType', 'user');
          navigate("/reportissue", { state: { userType: userType } });
        }}
      />

      {/* Tabs - Different for User and Agency */}
      <div className="flex gap-6 mb-8 text-sm">
        {userType === "user" ? (
          <>
            <button className="font-medium text-black border-b-2 border-black pb-1">
              Uploaded
            </button>
            <button className="text-gray-500">Upvoted</button>
            <button className="text-gray-500">Saved</button>
          </>
        ) : (
          <>
            <button className="font-medium text-black border-b-2 border-black pb-1">
              Verified
            </button>
            <button className="text-gray-500">Saved</button>
          </>
        )}
      </div>

      {/* Cards */}
      {/* <div
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
            if (userType === "agency") {
              // Agency: Navigate to PostDetail page for verification
              savePostData({
                address: "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd",
                images: [],
                userType: userType,
                status: "Awaiting Approval",
                username: "ari_archit_",
                uploaded_at: new Date().toISOString(),
                post_id: "dummy_1"
              });

              navigate("/postdetail", {
                state: {
                  userType: userType,
                  post: {
                    landmark: "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd",
                    road_condition: "Awaiting Approval",
                    username: "ari_archit_",
                    uploaded_at: new Date().toISOString(),
                    post_id: "dummy_1"
                  }
                }
              });
            } else {
              // User: Navigate to BiddingDetail page
              savePostData({
                address: "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd",
                images: [],
                userType: userType,
                status: "Awaiting Approval",
                username: "ari_archit_",
                uploaded_at: new Date().toISOString(),
                post_id: "dummy_1"
              });

              navigate("/bidding", {
                state: {
                  userType: userType,
                  post: {
                    landmark: "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd",
                    road_condition: "Awaiting Approval",
                    username: "ari_archit_",
                    uploaded_at: new Date().toISOString(),
                    post_id: "dummy_1"
                  }
                }
              });
            }
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
            if (userType === "agency") {
              // Agency: Navigate to PostDetail page for verification
              savePostData({
                address: "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd",
                images: [],
                userType: userType,
                status: "Approved",
                username: "ari_archit_",
                uploaded_at: new Date().toISOString(),
                post_id: "dummy_2"
              });

              navigate("/postdetail", {
                state: {
                  userType: userType,
                  post: {
                    landmark: "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd",
                    road_condition: "Approved",
                    username: "ari_archit_",
                    uploaded_at: new Date().toISOString(),
                    post_id: "dummy_2"
                  }
                }
              });
            } else {
              // User: Navigate to BiddingDetail page
              savePostData({
                address: "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd",
                images: [],
                userType: userType,
                status: "Approved",
                username: "ari_archit_",
                uploaded_at: new Date().toISOString(),
                post_id: "dummy_2"
              });

              navigate("/bidding", {
                state: {
                  userType: userType,
                  post: {
                    landmark: "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd",
                    road_condition: "Approved",
                    username: "ari_archit_",
                    uploaded_at: new Date().toISOString(),
                    post_id: "dummy_2"
                  }
                }
              });
            }
          }}
        />
      </div> */}
    </div>
  );
};

export default Profile;
