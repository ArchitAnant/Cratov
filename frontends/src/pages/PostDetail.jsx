import { useEffect, useState } from "react";
import { getPostData, savePostData } from "../context/post";
import { useLogin } from "../context/LoginContext";
import { data, useLocation, useNavigate } from "react-router-dom";
import { ActionButton, ImageGallery } from "../components/Action";
import { Bookmark, CornerLeftUp } from "lucide-react";
import { fetchImageData } from "../helper";
import PostPageInfoCard from "../components/PostInfoCard";
import MapSelector from "../components/MapSelector";
import BidStatus from "../components/BidStatus";

const PostDetail = () => {
  const [post, setPost] = useState({ address: "", images: [],coordinates: { lat: 0.00, lon: 0.00} });
  const [loading,setLoading] = useState(true)
  const locationState = useLocation();
  const navigate = useNavigate();
  const { userType } = useLogin();

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
    setLoading(true)

    
    // Check if post data came from navigation state first
    if (locationState.state?.post) {
     fetchImageData(locationState.state.post.postID).then((imagesObj) => {
      const imagesArray = Object.values(imagesObj); 
      setPost({ ...locationState.state.post, images: imagesArray,coordinates: locationState.state.post.coordinates || { lat: 0.00, lon: 0.00 } });
      setLoading(false);
      
    });
    } else {
      // Fallback to saved post data
      const data = getPostData();
      if (data) {
        setPost(data);
        
      }
    }
  }, [locationState]);

  return (
    <>
    {!loading ? (
    <div className="min-h-screen bg-white pt-14 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-[30px] font-medium">Pothole Report</h2>
          <p className="text-[18px] max-w-[300px] text-black text-opacity-80 font-regular mt-7 mb-5">
            {post.landmark || post.address || "No address provided"}


          </p>
          {post.coordinates.lat && post.coordinates.lon && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Location Map:</h3>
              <MapSelector
                location={{
                  lat: post.coordinates.lat,
                  lon: post.coordinates.lon
                }}
                onLocationSelect={() => {}} // Read-only map for approval
              />
            </div>
          )}

          {/* Current Status */}
          <div className="mb-4">
            <p className="text-[16px] text-black text-opacity-50 font-medium mb-2">Current Status :</p>
            <BidStatus
              status={post.road_condition || post.status || "Awaiting Approval"}
            />

            {/* <p className="text-[14px] text-[#9D0202] font-regular">
              • {post.road_condition || post.status || "Awaiting Approval"}

            </p> */}
          </div>
          <div className="mt-20"></div>

          {/* Image Gallery - Using standardized component */}
          <ImageGallery
            images={post.images}
            size="large"
            className="mb-6"
          />
          <div className="mt-20"></div>

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
        <PostPageInfoCard
        submittedBy={{
            name: post.username || "Anonymous",
            avatar: post.userAvatar || "https://i.ibb.co/Gt47sS0/avatar.png"
          }}
          submittedOn={post.uploaded_at ? new Date(post.uploaded_at).toLocaleDateString() : "Recently"}
          reportStatus={post.post_condition==="On Bid" ? 
            <button className="text-black text-[12px] underline font-medium hover:text-blue-500 animation-all duration-300"
            onClick={() => {
              navigate("/showReport", {
                state: { post: post }
              });
            }}
            >
              Generate Pre-Repair Report
            </button>
             : "Pre-Repair Report is awaiting the Approval"}
          showBookmark={false}
          className="md:w-[30%] w-full"
          >
          
          {userType=== "agency" && post.post_condition==="Awaiting Approval"&& (
            <>
            <div className="pt-10"></div>
            <ActionButton action={"Verify"} onClick={() => {
                        // Save post data for Agency Approval page
                        savePostData({
                          address: post.address || post.landmark || "Address not available",
                          images: post.images || [],
                          userType: "agency",
                          status: post.status || post.post_condition || "Awaiting Approval",
                          username: post.username || "ari_archit_",
                          uploaded_at: post.uploaded_at || new Date().toISOString(),
                          post_id: post.post_id || "unknown",
                          coordinates: post.coordinates || { lat: "22.5726", lon: "88.3639" }
                        });

                        navigate("/agency-approval", { state: { userType: "agency", post: post } });
                      }
              
            }></ActionButton>
            </>
          )
          }

        </PostPageInfoCard>
      </div>
    </div>):
    <div>
      <p className="flex items-center justify-center text-center text-black text-opacity-50 min-h-screen">Fetching Post Details</p>
      </div>}
    </>
  );
};

export default PostDetail;

