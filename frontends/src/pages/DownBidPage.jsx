import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getPostData } from '../context/post';
import PostInfoCard from '../components/PostInfoCard';
import { ActionButton } from '../components/Action';



// Example function to simulate a payment process
const processPayment = async (bidAmount, downPayment) => {
  console.log(`Starting payment of ₹${downPayment} for a bid of ₹${bidAmount}...`);
  // Simulate a delay to mimic a real payment process
  // For demonstration, we'll simulate a 3-second delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  
  if (Math.random() > 0.2) { 
    return { success: true, transactionId: `0x${Math.random().toString(16).slice(2)}` };
  } else {
    throw new Error("User rejected the transaction.");
  }
};

// --- Component ---

const DownBidPage = () => {
  const [bidAmount, setBidAmount] = useState('');
  const [downPayment, setDownPayment] = useState(0);
  const [post, setPost] = useState({});
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const navigate = useNavigate(); 

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

  const isButtonDisabled = !bidAmount || isPaymentPending;

  // Real logic to handle the downbid submission
  const handleDownbidSubmit = async () => {
    setIsPaymentPending(true);
    try {
      // 1. Call your function to interact with the wallet/blockchain
      const response = await processPayment(bidAmount, downPayment);
      console.log('Payment Response:', response);

      // 2. If successful, show success and navigate
      alert("Payment successful! Transaction ID: " + response.transactionId);
      setIsPaymentPending(false);
      navigate('/home'); 

    } catch (error) {
      // 3. If it fails, show an error and hide the overlay
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
      setIsPaymentPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-16 md:px-24 font-poppins relative overflow-hidden">
      {/* Main Content */}
      <div className={`transition-all duration-300 ${isPaymentPending ? 'blur-sm pointer-events-none' : ''}`}>
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
                reportLink={true}
            >
                <ActionButton
                    action="Downbid"
                    ifDisable={isButtonDisabled}
                    onClick={handleDownbidSubmit}
                />
            </PostInfoCard>
        </div>
      </div>

      {/* Payment Pending Overlay */}
      {isPaymentPending && (
        <>
            <div className="fixed top-0 left-0 w-full h-full bg-black opacity-30 z-40"></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg z-50 flex flex-col items-center justify-center gap-4">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <h2 className="font-semibold">Awaiting Payment</h2>
                <p className="text-center text-gray-600 text-sm">Waiting for confirmation from the wallet of the payment of the down payment</p>
            </div>
        </>
      )}
    </div>
  );
};

export default DownBidPage;