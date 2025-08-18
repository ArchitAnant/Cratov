import { useState, useEffect } from "react";
import { Bookmark, Star } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPostData } from "../context/post";
import { ActionButton } from "../components/Action"; // ActionButton import karein

const BiddingDetail = ({ userRole }) => {
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user role...</p>
      </div>
    );
  }

  // Conditionally render the correct component based on the role
  if (userRole === 'agency') {
    return <AgencyBiddingView />;
  } else {
    // For contractors and any other role, show the simple view
    return <ContractorBiddingView userRole={userRole} />;
  }
};


const AgencyBiddingView = () => {
  const [post, setPost] = useState({ address: "", images: [] });
  const [currentStage, setCurrentStage] = useState(1);
  const [rating, setRating] = useState(0);
  const locationState = useLocation();

  useEffect(() => {
    if (locationState.state?.post) {
      setPost(locationState.state.post);
    } else {
      const data = getPostData();
      if (data) setPost(data);
    }

    if (locationState.state?.stage) {
      setCurrentStage(locationState.state.stage);
    } else if (locationState.state?.fromAgencyApproval) {
      setCurrentStage(1);
    } else {
      const savedData = getPostData();
      if (savedData?.stage) {
        setCurrentStage(savedData.stage);
      } else if (savedData?.agency_approved) {
        setCurrentStage(1);
      }
    }
  }, [locationState]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* ========= Left Section ========= */}
        <div className="flex-1">
          <div>
            <h1 className="text-[24px] font-semibold mb-1">Pothole Report</h1>
            <p className="text-[14px] text-gray-600">{post.landmark || post.address || "No address provided"}</p>
          </div>
          <div className="mt-6 mb-4">
            <h3 className="text-[14px] font-medium mb-2 text-gray-600">Current Status :</h3>
            <ul className="list-disc ml-5 text-[14px] space-y-1">
              {currentStage >= 1 && currentStage <= 2 && <li className="text-green-600">Approved</li>}
              {currentStage >= 1 && currentStage <= 2 && <li className="text-red-500">On Bid</li>}
              {currentStage === 3 && <><li className="text-green-600">Approved</li><li className="text-green-600">Finished Bidding</li><li className="text-red-500">In Progress</li></>}
              {currentStage === 4 && <><li className="text-green-600">Approved</li><li className="text-green-600">Finished Bidding</li><li className="text-green-600">Finished Construction</li><li className="text-red-500">Funded</li></>}
              {currentStage >= 5 && <><li className="text-green-600">Approved</li><li className="text-green-600">Finished Bidding</li><li className="text-green-600">Finished Construction</li><li className="text-green-600">Funded</li></>}
            </ul>
          </div>
          <div className="flex gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (<div key={index} className="w-[80px] h-[80px] bg-gray-200 rounded-[20px]" />))}
          </div>
          <div>
            <h3 className="text-[14px] font-medium mb-2 text-gray-600">{currentStage >= 3 ? "Appointed to :" : "Current Bidding :"}</h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center"><div className="w-2.5 h-2.5 bg-white rounded-full"></div></div>
                <p className="font-semibold text-[18px]">₹1.50 Cr</p>
                <span className="text-[14px] text-gray-600 ml-2">{currentStage === 1 ? "Awaiting Bidder" : "Spector Constructions"}</span>
              </div>
              {currentStage >= 2 && (<div className="flex items-center gap-1 ml-7"><Star size={14} className="text-gray-400" /><span className="text-[14px] text-[#9A9A9A]">4.2/5.0</span></div>)}
            </div>
            {currentStage >= 5 && (
              <div className="mt-6">
                <h3 className="text-[14px] font-medium mb-2 text-gray-600">Rate the construction :</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (<Star key={star} size={24} className={`cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} onClick={() => setRating(star)} />))}
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-2 flex-wrap">
              <button onClick={() => setCurrentStage(1)} className={`px-3 py-1 text-sm rounded ${currentStage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Stage 1</button>
              <button onClick={() => setCurrentStage(2)} className={`px-3 py-1 text-sm rounded ${currentStage === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Stage 2</button>
              <button onClick={() => setCurrentStage(3)} className={`px-3 py-1 text-sm rounded ${currentStage === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Stage 3</button>
              <button onClick={() => setCurrentStage(4)} className={`px-3 py-1 text-sm rounded ${currentStage === 4 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Stage 4</button>
              <button onClick={() => setCurrentStage(5)} className={`px-3 py-1 text-sm rounded ${currentStage === 5 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Stage 5</button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[30%] flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Bookmark className="text-black" />
              <h4 className="text-[18px] font-semibold">About the post :</h4>
            </div>
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Submitted By :</p>
              <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/40" alt="avatar" className="w-[30px] h-[30px] rounded-full" />
                <span className="font-medium">@{post.username || "Anonymous"}</span>
              </div>
            </div>
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Submitted On :</p>
              <p className="text-[14px] font-medium">{post.uploaded_at ? new Date(post.uploaded_at).toLocaleDateString() : "Recently"}</p>
            </div>
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Pre-Repair Report :</p>
              <button onClick={() => alert("Download started")} className="text-blue-600 underline hover:text-blue-800 text-[14px]">Download Pre-Repair Report</button>
            </div>
        </div>
      </div>
    </div>
  );
};


const ContractorBiddingView = ({ userRole }) => {
  const [post, setPost] = useState({ address: "", images: [] });
  const locationState = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (locationState.state?.post) {
      setPost(locationState.state.post);
    } else {
      const data = getPostData();
      if (data) setPost(data);
    }
  }, [locationState]);

  const isContractor = userRole === 'contractor';

  const handleDownbidClick = () => {
    navigate('/down-bid');
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-[86px] font-poppins">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Left Section */}
        <div className="flex-1">
          <div>
            <h1 className="text-[24px] font-semibold mb-1">Pothole Report</h1>
            <p className="text-[14px] text-gray-600">{post.landmark || "48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd"}</p>
          </div>
          <div className="mt-6 mb-4">
            <h3 className="text-[14px] font-medium mb-2 text-gray-600">Current Status :</h3>
            <ul className="list-disc ml-5 text-[14px] space-y-1">
              <li className="text-green-600">Approved</li>
              <li className="text-red-500">On Bid</li>
            </ul>
          </div>
          <div className="flex gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (<div key={index} className="w-[80px] h-[80px] bg-gray-200 rounded-[20px]" />))}
          </div>
          <div>
            <h3 className="text-[14px] font-medium mb-2 text-gray-600">Current Bidding :</h3>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center"><div className="w-2.5 h-2.5 bg-white rounded-full"></div></div>
              <p className="font-semibold text-[18px]">₹1.50 Cr</p>
              <span className="text-[14px] text-gray-600 ml-2">Awaiting Bidder</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[30%]">
          <div className="flex items-center gap-2 mb-6">
            <Bookmark className="text-black" />
            <h4 className="text-[18px] font-semibold">About the post :</h4>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Submitted By :</p>
              <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/40" alt="avatar" className="w-[30px] h-[30px] rounded-full" />
                <span className="font-medium">@{post.username || "ari_archit_"}</span>
              </div>
            </div>
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Submitted On :</p>
              <p className="text-[14px] font-medium">{post.uploaded_at ? new Date(post.uploaded_at).toLocaleDateString() : "27th June 2025"}</p>
            </div>
            <div>
              <p className="text-[14px] text-gray-500 mb-1">Pre-Repair Report :</p>
              <button onClick={() => alert("Download started")} className="text-blue-600 underline hover:text-blue-800 text-[14px]">Download Pre-Repair Report</button>
            </div>
          </div>
          {isContractor && (
            <div className="mt-8 flex justify-left items-center">
              {/* Purana button hata kar ActionButton use kiya gaya hai */}
              <ActionButton
                action="Downbid"
                onClick={handleDownbidClick}
                ifDisable={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiddingDetail;