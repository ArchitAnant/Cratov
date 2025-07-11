import { useEffect, useState } from "react";
import { getPostData, savePostData } from "../context/post";
import { useLogin } from "../context/LoginContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionButton, ImageGallery } from "../components/Action";
import { Bookmark, CornerLeftUp } from "lucide-react";

const PostDetail = () => {
  const [post, setPost] = useState({ address: "", images: [] });
  const locationState = useLocation();
  const navigate = useNavigate();
  const { userType } = useLogin();

  // Check navigation state first, then fallback to LoginContext, then saved post data
  // Also check if we came from agency flow
  const referrer = document.referrer;
  const cameFromAgencyFlow = referrer.includes('/agency-profile') ||
                            locationState.state?.userType === "agency" ||
                            post.userType === "agency" ||
                            sessionStorage.getItem('lastProfileType') === 'agency';

  let currentUserType = locationState.state?.userType || userType || post.userType;

  // Override if we came from agency flow
  if (cameFromAgencyFlow && currentUserType !== "agency") {
    currentUserType = "agency";
  }

  const isAgency = currentUserType === "agency";

  useEffect(() => {
    // Check if post data came from navigation state first
    if (locationState.state?.post) {
      setPost(locationState.state.post);
    } else {
      // Fallback to saved post data
      const data = getPostData();
      if (data) setPost(data);
    }
  }, [locationState]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-[24px] font-semibold mb-2">Pothole Report</h2>
          <p className="text-[14px] text-gray-600 mb-4">
            {post.landmark || post.address || "No address provided"}
          </p>

          {/* Current Status */}
          <div className="mb-4">
            <p className="text-[14px] text-gray-700">Current Status :</p>
            <p className="text-[12px] text-red-500 font-medium">
              • {post.road_condition || post.status || "Awaiting Approval"}
            </p>
          </div>

          {/* Image Gallery - Using standardized component */}
          <ImageGallery
            images={post.images}
            size="medium"
            className="mb-6"
          />

          {/* Conditional Buttons based on user type - Using standardized components */}
          <div className="flex items-center gap-4">
            {!isAgency && (
              // Upvote section for regular users only
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    // Save post data for BiddingDetail page
                    const biddingData = {
                      address: post.landmark || post.address || "No address provided",
                      images: post.images || [],
                      userType: currentUserType,
                      status: post.road_condition || post.status || "Awaiting Approval",
                      username: post.username || "Anonymous",
                      uploaded_at: post.uploaded_at,
                      post_id: post.post_id || post.postID
                    };

                    // Navigate to BiddingDetail page
                    navigate("/bidding", {
                      state: {
                        userType: currentUserType,
                        post: biddingData
                      }
                    });
                  }}
                  className="flex items-center justify-center gap-2
                    w-[146px] h-[56px] rounded-[49px]
                    bg-[#D9D9D9] text-black
                    hover:bg-blue-500 hover:text-white
                    transition-all duration-300 ease-in-out
                    group"
                >
                  <span className="text-[16px] font-medium">Upvote</span>
                  <CornerLeftUp
                    size={20}
                    className="transition-all duration-300 ease-in-out group-hover:scale-110"
                  />
                </button>
                <p className="text-[16px] font-medium">56</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[30%] flex flex-col gap-4">
          {/* Bookmark + About Heading */}
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
                  <span className="font-medium">{post.username || "Anonymous"}</span>
                </div>
              </div>

              {/* Submitted On */}
              <div>
                <p className="text-gray-500 mb-1">Submitted On :</p>
                <p className="font-medium">
                  {post.uploaded_at ? new Date(post.uploaded_at).toLocaleDateString() : "Recently"}
                </p>
              </div>

              {/* Pre-Repair Report */}
              <div>
                <p className="text-gray-500 mb-1">Pre-Repair Report :</p>
                <p className="text-[12px] text-gray-500">
                  Pre-Repair Report is awaiting the Approval
                </p>
                {/* Verify button for Agency users in Pre-Repair Report section */}
                {isAgency && (
                  <div className="mt-12">
                    <ActionButton
                      onClick={() => {
                        // Save post data for Agency Approval page
                        savePostData({
                          address: post.address || post.landmark || "Address not available",
                          images: post.images || [],
                          userType: "agency",
                          status: post.status || post.road_condition || "Awaiting Approval",
                          username: post.username || "ari_archit_",
                          uploaded_at: post.uploaded_at || new Date().toISOString(),
                          post_id: post.post_id || "unknown",
                          coordinates: post.coordinates || { lat: "22.5726", lon: "88.3639" }
                        });

                        navigate("/agency-approval", { state: { userType: "agency", post: post } });
                      }}
                      action="Verify"
                      ifDisable={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
