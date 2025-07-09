import React from "react";
import { Plus } from "lucide-react";
import MapSelector from "./MapSelector";

const ReportIssueForm = ({
  isAgency = false,
  address,
  setAddress,
  error,
  location,
  images,
  handleImageUpload,
  onLocationSelect,
}) => {
  return (
    <div className="flex-1 pl-[86px]">
      <h2
        className="text-[30px] font-medium mb-[60px]"
        style={{ lineHeight: "100%", color: "#000000" }}
      >
        {isAgency ? "Verify Pothole Report" : "Report A Pothole"}
      </h2>
      {/* Address Section */}
      <div className="mb-7">
        <h1 className="flex items-center gap-2 text-[15px] text-black opacity-50 font-lg font-medium pb-3">Add nearby Landmarks</h1>
        <input
          type="text"
          placeholder="Enter location or address"
          className="border text-[15px] border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-600 transition-colors duration-200"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}
      {!location && !error && <p className="text-gray-600">Fetching your location...</p>}
      {location && (
        <MapSelector
          location={location}
          onLocationSelect={onLocationSelect}
        />
      )}
      <div className="mb-8">
        <h4
          className="text-[18px]  mb-4 mt-10"
          style={{ lineHeight: "100%", color: "#000000" }}
        >
          Add Images
        </h4>
        <div className="flex gap-4 flex-wrap mt-8">
          {images.map((img, index) => (
            <label
              key={index}
              className={`w-[114px] h-[114px] flex items-center justify-center rounded-[21px] bg-black cursor-pointer ${!img ? "bg-opacity-10 " : "bg-opacity-100  border border-black"}`}
            >
              {img ? (
                <img
                  src={URL.createObjectURL(img)}
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
  );
};

export default ReportIssueForm;
