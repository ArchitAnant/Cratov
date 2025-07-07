import { Bookmark, ArrowRight} from "lucide-react";
import Footer from "../components/Footer";

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

  {/* Cards Container */}
  <div style={{ position: 'relative', minHeight: '300px' }}>
    {/* Card 1 */}
    <div
      style={{
        width: '298px',
        height: '266px',
        position: 'absolute',
        top: '0px',
        left: '0px',
        opacity: 3,
        borderRadius: '49px', 
        border: '1px solid #ccc',
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor: '#D9D9D9',
      }}
    >
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm text-black font-medium">ari_archit_</p>
            <p className="text-xs text-gray-500">2 days ago</p>
          </div>
        </div>
        <Bookmark size={18} className="text-gray-700 cursor-pointer" />
      </div>
      <p className="text-sm text-gray-700 leading-tight mb-2">
        48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd
      </p>
      <p className="text-xs text-red-500 font-medium mb-2">Awaiting Approval</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-black">📞 56</p>
        <button
          className="flex items-center justify-center gap-2 
          w-[137px] h-[40px] rounded-[49px] 
          bg-black text-white text-sm hover:bg-gray-800"
        >
          Expand <ArrowRight size={14} />
        </button>
      </div>
    </div>

    {/* Card 2 */}
    <div
      style={{
        width: '298px',
        height: '266px',
        position: 'absolute',
        top: '0px',
        left: '330px',
        opacity: 3,
        borderRadius: '49px',
        border: '1px solid #ccc',
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor: '#D9D9D9',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm text-black font-medium">ari_archit_</p>
            <p className="text-xs text-gray-500">2 days ago</p>
          </div>
        </div>
        <Bookmark size={18} className="text-gray-700 cursor-pointer" />
      </div>
      <p className="text-sm text-gray-700 leading-tight mb-2">
        48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd
      </p>
      <p className="text-xs text-green-600 font-medium mb-1">Approved</p>
      <p className="text-xs text-yellow-500 font-medium mb-2">On Bid</p>
      <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#fff]/50 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <p className="text-sm font-semibold">₹1.50 Cr</p>
        <button
          className="flex items-center justify-center gap-2 
          w-[137px] h-[40px] rounded-[49px] 
          bg-black text-white text-sm hover:bg-gray-800"
        >
          Expand <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default Home;
