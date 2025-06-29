import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GuideLineBar from "../components/Action";

const ReportIssue = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [address, setAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  const handleVerify = () => {
    if (!address) {
      alert("Please add an address.");
      return;
    }
    if (images.some((img) => img === null)) {
      alert("Please upload all 4 images.");
      return;
    }
    navigate("/verify");
  };

  return (
    <div className="font-poppins flex flex-col md:flex-row gap-8 pt-24 mb-10 min-h-screen bg-white">
      {/* Left Section */}
      <div className="flex-1 pl-[86px]">
        <h2
          className="text-[30px] font-medium mb-[60px]"
          style={{ lineHeight: "100%", color: "#000000" }}
        >
          Report A Pothole
        </h2>

        {/* Address Section */}
        <div className="mb-20">
          {showAddressInput ? (
            <input
              type="text"
              placeholder="Enter location or address"
              className="border border-gray-300 rounded-full px-4 py-2 w-full focus:outline-none focus:ring focus:ring-gray-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          ) : (
            <button
              onClick={() => setShowAddressInput(true)}
              className="flex items-center gap-2 text-[18px] text-black opacity-80"
            >
              <Plus size={18} />
              Add Address
            </button>
          )}
        </div>


        <div className="mb-8">
          <h4
            className="text-[18px]  mb-4 mt-10"
            style={{
              lineHeight: "100%",
              color: "#000000",
            }}
          >
            Add Images
          </h4>
          <div className="flex gap-4 flex-wrap mt-8">
            {images.map((img, index) => (
              <label
                key={index}
                className={`w-[114px] h-[114px] flex items-center justify-center 
                  rounded-[21px] bg-black cursor-pointer ${!img? "bg-opacity-10 ": "bg-opacity-100  border border-black"}`}
                // style={{ opacity: img ? 1 : 0.1 }}
              >
                {img ? (
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover rounded-[21px]"
                  />
                ) : (
                  <div className="opacity-100 text-black">
                    <Plus size={32} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(index, e)}
                />
                
              </label>
            ))}
          </div>
        </div>
      </div>
      <GuideLineBar
        onActionButtonClick={handleVerify}
        actionButtonText="Verify"
      />
      </div>
  );
};

export default ReportIssue;
