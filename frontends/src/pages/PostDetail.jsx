import { useEffect, useState } from "react";
import { getPostData } from "../context/post";
import { useLogin } from "../context/LoginContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionButton, Button, ImageGallery } from "../components/Action";
import { Bookmark, CornerLeftUp } from "lucide-react";
import PostPageInfoCard from "../components/PostInfoCard";

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
    const data = getPostData();
    if (data) setPost(data);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-14 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-[30px] font-medium">Pothole Report</h2>
          <p className="text-[18px] max-w-[300px] text-black text-opacity-80 font-regular mt-7 mb-5">
            {post.address || "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd"}
          </p>

          {/* Current Status */}
          <div className="mb-4">
            <p className="text-[16px] text-black text-opacity-50 font-medium mb-2">Current Status :</p>
            <p className="text-[14px] text-[#9D0202] font-regular">
              • Awaiting Approval
            </p>
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
                  onClick={() => console.log("Upvote clicked")}
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
        <PostPageInfoCard>
          {userType=== "agency" && (
            <>
            <div className="pt-10"></div>
            <ActionButton action={"Verify"} onClick={console.log("yoyoyo")}></ActionButton>
            </>
          )
          }

        </PostPageInfoCard>
      </div>
    </div>
  );
};

export default PostDetail;
