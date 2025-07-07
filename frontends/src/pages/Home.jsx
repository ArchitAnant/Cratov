import { Bookmark, ArrowRight} from "lucide-react";
import StatusCard from "../components/StatusCard";

const Home = () => {
  return (
    <div className="font-poppins px-8 py-10 min-h-screen bg-white">
      
      {/* Search */}
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-[36px] md:text-[30px] font-medium text-black mb-7">Search</h2>
        <div className="flex items-center w-full max-w-md p-1 rounded-full ">
           <input
              type="text"
              placeholder="Search by user id or location"
              className="flex-grow font-regular ps-5 py-2 rounded-full focus:outline-none focus:border-2 focus:border-blue-600 transition-border duration-300 bg-black bg-opacity-5 h-[55px] text-[13px]"
            />
          <div className="ml-5 p-[2px] rounded-full ">
              <button className="bg-black rounded-full w-[48px] h-[48px] flex items-center justify-center hover:bg-gray-600 transition-colors duration-300">
                {/* <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-lg font-bold">→</span> */}
                <ArrowRight size={20} className="text-white" />
              </button>
            </div>
        </div>
        
      </div>

{/* Explore */}
<div>
  <h2 className="text-[22px] md:text-[26px] font-medium text-black mb-4">Explore</h2>
  <div className="flex gap-6 mb-8">
    <button className="font-medium text-black border-b-2 border-black">Recent</button>
    <button className="text-gray-500">Trending</button>
  </div>
  <StatusCard 
  username={"ari_archit_"} 
  time={"2 days ago"} 
  address={"48, Thakurpukur, Bibirhat - Bakhrahat - Raipur Rd"}
    status={"Awaiting Approval"}
    bidStatus={""}
    voteCount={56}
    price={""}
    ></StatusCard>

  {/* Cards Container */}

</div>
    </div>
  );
};

export default Home;
