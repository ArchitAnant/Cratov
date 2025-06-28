import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="font-poppins flex flex-col md:flex-row gap-8 pt-24 pb-10 min-h-screen bg-white">
      {/* Left Section */}
      <div className="flex-1 pl-[86px]">
        <h2
          className="text-[30px] font-medium mb-8"
          style={{ lineHeight: "100%", color: "#000000" }}
        >
          Report A Pothole
        </h2>

        {/* Address Section */}
        <div className="mb-10">
          {showAddressInput ? (
            <input
              type="text"
              placeholder="Enter location or address"
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring focus:ring-gray-400"
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

        {/* Image Upload */}
        <div className="mb-8">
          <h4
            className="text-[18px] font-normal mb-4"
            style={{
              lineHeight: "100%",
              color: "#000000",
            }}
          >
            Add Images
          </h4>

          <div className="flex gap-4 flex-wrap">
            {images.map((img, index) => (
              <label
                key={index}
                className="w-[114px] h-[114px] flex items-center justify-center 
                  rounded-[21px] bg-gray-200 cursor-pointer border border-black"
                style={{ opacity: img ? 1 : 0.1 }}
              >
                {img ? (
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover rounded-[21px]"
                  />
                ) : (
                  <Plus size={32} color="#000000" className="opacity-80" />
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

      {/* Right Section */}
      <div className="w-full md:w-[30%] pr-[86px]">
        <div className="mb-8">
          <h4 className="font-semibold text-lg mb-2">Guidelines :</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Add the location properly</li>
            <li>Make sure the images are clear and show the entire potholes</li>
            <li>You need to upload all 4 images.</li>
          </ul>
        </div>

        <div className="mb-10">
          <h4 className="font-semibold text-lg mb-2">Cautions :</h4>
          <p className="text-sm text-gray-700">
            Don’t upload unwanted images or misleading information. Uploading
            such images would lead to account termination.
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="flex items-center justify-center gap-2 
            w-[137px] h-[40px] rounded-[49px] 
            bg-black text-white text-base 
            hover:bg-gray-800"
        >
          Verify <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default ReportIssue;
