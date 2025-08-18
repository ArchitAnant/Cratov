import { useState, useEffect } from 'react';
import { getPostData } from '../context/post';
import PostInfoCard from '../components/PostInfoCard';
import { ActionButton } from '../components/Action';

const DownBidPage = () => {
  const [bidAmount, setBidAmount] = useState('');
  const [downPayment, setDownPayment] = useState(0);
  const [post, setPost] = useState({});

  useEffect(() => {
    const postData = getPostData();
    if (postData) {
      setPost(postData);
    }
  }, []);

  const handleBidChange = (e) => {
    const amount = e.target.value;
    setBidAmount(amount);

    if (amount && !isNaN(amount)) {
      const payment = parseFloat(amount) * 0.01;
      setDownPayment(payment.toFixed(2));
    } else {
      setDownPayment(0);
    }
  };

  const isButtonDisabled = !bidAmount;

  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-16 md:px-24 font-poppins">
      <div className="flex flex-col md:flex-row gap-16 justify-between">
        
        {/* ========= Left Section ========= */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-3xl font-semibold mb-4">Down Bid</h1>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <p className="font-semibold text-lg">₹{post.price || '1.50 Cr'}</p>
            <span className="text-sm text-gray-500">Awaiting Bidder</span>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter down bid amount :
            </label>
            <input
              type="number"
              value={bidAmount}
              onChange={handleBidChange}
              placeholder="Enter an amount less than the current bid"
              className="w-full md:w-2/3 bg-gray-100 border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-gray-600 leading-relaxed">
              In order to make a down bid a down payment is needed, which will be 1% of your down bid amount. <br />
              If you are out-bidden, your down payment will be refunded.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Calculated down payment amount :</h3>
            <div className="w-full md:w-2/3 bg-gray-100 border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-500">
              {bidAmount ? `₹${downPayment}` : 'Enter a bid amount to see the down payment.'}
            </div>
          </div>
        </div>

        {/* ========= Right Sidebar using PostPageInfoCard ========= */}
        <PostInfoCard
          title="About the bid :"
          submittedBy={{
            name: post.username || '...',
            avatar: post.avatar || "https://i.ibb.co/Gt47sS0/avatar.png"
          }}
          submittedOn={post.uploaded_at ? new Date(post.uploaded_at).toLocaleDateString() : '...'}
          showBookmark={true}
          reportLink={true} // Naya prop yahan use kiya gaya hai
        >
          {/* ActionButton is passed as a child */}
          <div className="flex justify-start items-center">
            <ActionButton
              action="Downbid"
              ifDisable={isButtonDisabled}
              onClick={() => alert("Downbid Submitted!")}
            />
          </div>
        </PostInfoCard>
      </div>
    </div>
  );
};

export default DownBidPage;