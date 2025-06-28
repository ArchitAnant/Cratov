import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
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
    navigate("/verify"); // Next page route
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 px-8 py-10 min-h-screen bg-white">
      {/* Left Section */}
      <div className="flex-1">
        <h2 className="text-3xl font-semibold mb-6">Report A Pothole</h2>

        {/* Address Section */}
        <div className="mb-8">
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
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              <Plus size={18} />
              <span className="text-base">Add Address</span>
            </button>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <h4 className="text-lg mb-4">Add Images</h4>
          <div className="flex gap-4 flex-wrap">
            {images.map((img, index) => (
              <label
                key={index}
                className="w-20 h-20 flex items-center justify-center rounded-lg bg-gray-200 cursor-pointer hover:bg-gray-300"
              >
                {img ? (
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Plus size={24} className="text-gray-600" />
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
      <div className="w-full md:w-[30%]">
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
          className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
        >
          Verify
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default ReportIssue;
