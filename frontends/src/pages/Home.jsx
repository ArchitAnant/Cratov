import { Bookmark, ArrowRight} from "lucide-react";
import StatusCard from "../components/StatusCard";
import { Button } from "../components/Action";
import { useLogin } from "../context/LoginContext";

const Home = () => {
  const { userType } = useLogin();

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
              <Button
                variant="primary"
                className="rounded-full w-[48px] h-[48px] p-0"
                onClick={() => console.log("Search clicked")}
              >
                <ArrowRight size={20} />
              </Button>
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
    userType={userType}
    onExpand={() => console.log("Expand clicked")}
  />

  {/* Cards Container */}

</div>
    </div>
  );
};

export default Home;
