import { useState, useEffect } from "react";
import { Bookmark, ArrowRight} from "lucide-react";
import StatusCard from "../components/StatusCard";
import { Button } from "../components/Action";
import { useLogin } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { getPostList } from "../helper";
import { savePostData } from "../context/post";


const Home = () => {
  const { userType } = useLogin();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Only fetch backend posts - no local mixing
        const fetchedPosts = await getPostList();

        // Sort by uploaded_at (newest first)
        const sortedPosts = fetchedPosts
          .sort((a, b) => new Date(b.uploaded_at || b.timestamp || 0) - new Date(a.uploaded_at || a.timestamp || 0));

        setPosts(sortedPosts);

      } catch (error) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
                onClick={() => {}}
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
  {/* Posts Container */}
  {loading ? (
    <div className="text-center py-8">
      <p className="text-gray-500">Loading posts...</p>
    </div>
  ) : posts.length > 0 ? (
    <div className="flex flex-wrap gap-6 justify-start">
      {posts.map((post, index) => (
        <StatusCard
          key={post.post_id || post.postID || index}
          username={post.username || "Lolading"}
          time={post.uploaded_at ? new Date(post.uploaded_at).toLocaleDateString() : "Loading"}
          address={post.landmark || "Location not specified"}
          status={post.post_condition || "Awaiting Approval"}
          bidStatus=""
          voteCount={0}
          price=""
          userType={userType}
          onExpand={() => {
            // Save post data for PostDetail page
            savePostData({
              address: post.landmark || "Location not specified",
              images: [], // Backend images can be added later
              userType: userType,
              status: post.road_condition || "Awaiting Approval",
              username: post.username || "Anonymous",
              uploaded_at: post.uploaded_at,
              post_id: post.post_id
            });

            // Navigate to PostDetail page
            navigate("/postdetail", {
              state: {
                userType: userType,
                post: post
              }
            });
          }}
        />
      ))}
    </div>
  ) : (
    <div className="text-center py-8">
      <p className="text-gray-500">No posts available. Be the first to report a pothole!</p>
    </div>
  )}

</div>
    </div>
  );
};

export default Home;
