import { Bookmark } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPostData } from "../context/post";

const BiddingDetail = ({ userRole }) => {
  const [post, setPost] = useState({ address: "", images: [] });
  const locationState = useLocation();

  useEffect(() => {
    if (locationState.state?.post) {
      setPost(locationState.state.post);
    } else {
      const data = getPostData();
      if (data) setPost(data);
    }
  }, [locationState]);

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user role...</p>
      </div>
    );
  }

  const isContractor = userRole === 'contractor';

  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* ========= Left Section ========= */}
        <div className="flex-1">
          {/* Title & Address */}
          <div>
            <h1 className="text-[24px] font-semibold mb-1">Pothole Report</h1>
            <p className="text-[14px] text-gray-600">
              {post.landmark || "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd"}
            </p>
          </div>

          {/* Current Status (Static) */}
          <div className="mt-6 mb-4">
            <h3 className="text-[14px] font-medium mb-2 text-gray-600">Current Status :</h3>
            <ul className="list-disc ml-5 text-[14px] space-y-1">
              <li className="text-green-600">Approved</li>
              <li className="text-red-500">On Bid</li>
            </ul>
          </div>

          {/* Images */}
          <div className="flex gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-[80px] h-[80px] bg-gray-200 rounded-[20px]" />
            ))}
          </div>

          {/* Current Bidding (Static) */}
          <div>
            <h3 className="text-[14px] font-medium mb-2 text-gray-600">Current Bidding :</h3>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <p className="font-semibold text-[18px]">₹1.50 Cr</p>
              <span className="text-[14px] text-gray-600 ml-2">Awaiting Bidder</span>
            </div>
          </div>
        </div>

        {/* ========= Right Sidebar ========= */}
        <div className="w-full md:w-[30%]">
          <div className="flex items-center gap-2 mb-6">
            <Bookmark className="text-black" />
            <h4 className="text-[18px] font-semibold">About the post :</h4>
          </div>

          <div className="space-y-4">
            {/* Submitted By */}
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Submitted By :</p>
              <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/40" alt="avatar" className="w-[30px] h-[30px] rounded-full" />
                <span className="font-medium">@{post.username || "ari_archit_"}</span>
              </div>
            </div>

            {/* Submitted On */}
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Submitted On :</p>
              <p className="text-[14px] font-medium">
                {post.uploaded_at ? new Date(post.uploaded_at).toLocaleDateString() : "27th June 2025"}
              </p>
            </div>

            {/* Pre-Repair Report */}
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Pre-Repair Report :</p>
              <button
                onClick={() => alert("Download started")}
                className="text-blue-600 underline hover:text-blue-800 text-[14px]"
              >
                Download Pre-Repair Report
              </button>
            </div>
          </div>
          
          {/* "Downbid" button - Centered and smaller */}
          {isContractor && (
            <div className="mt-8 flex justify-left items-center">
              <button className="bg-black text-white py-2 px-8 rounded-full hover:bg-gray-800 transition-colors text-xs font-semibold">
                Downbid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiddingDetail;