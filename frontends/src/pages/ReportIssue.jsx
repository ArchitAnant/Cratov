import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GuideLineBar from "../components/Action";
import { useUpload } from "../context/UploadContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { useEffect } from "react";

function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        setError("Permission denied or unavailable");
        console.error(err);
      }
    );
  }, []);

  return { location, error };
}

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
function LocationPicker({ initialPostion,onSelect }) {
  const [position, setPosition] = useState(initialPostion || null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  return position ? (
    <Marker position={position} draggable={true} icon={customIcon} />
  ) : null;
}

const MapSelector = ({ location, onLocationSelect }) => (
  <MapContainer
  className="h-[250px] w-[800px] mb-8 rounded-[21px] "
    center={[location.lat, location.lon]}
    zoom={13}
    // style={{ height: "400px", width: "100%", marginBottom: "2rem" }}
  >
    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <LocationPicker initialPostion={location} onSelect={onLocationSelect} />
  </MapContainer>
);


const ReportIssue = () => {
  const { images, setImages, location, setLocation, stringLandmark, setStringLandmark  } = useUpload();
  const [address, setAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const { location : coodinate, error: error } = useCurrentLocation();
  setLocation(coodinate);

  const navigate = useNavigate();


  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleVerify = () => {
    if (!address) {
      alert("Please add an address.");
      return;
    }
    else{
      setLocation(useMapEvents.location)
    }
    if (images.some((img) => img === null)) {
      alert("Please upload all 4 images.");
      return;
    }
    navigate("/verify");
  };

  return (
    <div className="font-poppins flex flex-col md:flex-row gap-8 mb-10 pt-24 min-h-screen bg-white">
      {/* Left Section */}
      
      <div className="flex-1 pl-[86px]">
        <h2
          className="text-[30px] font-medium mb-[60px]"
          style={{ lineHeight: "100%", color: "#000000" }}
        >
          Report A Pothole
        </h2>

        {/* Address Section */}
        <div className="mb-7">
          <h1  className="flex items-center gap-2 text-[15px] text-black opacity-50 font-lg font-medium pb-3">Add nearby Landmarks</h1>
            <input
              type="text"
              placeholder="Enter location or address"
              className="border text-[15px] border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-gray-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
         
        </div>
        {error && <p className="text-red-500">Error: {error}</p>}
      {!location && !error && <p className="text-gray-600">Fetching your location...</p>}
      {location && (
        <MapSelector
          location={location}
          onLocationSelect={(loc) => console.log("📍 Selected:", loc)}
        />
      )}
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

      <GuideLineBar
        onActionButtonClick={handleVerify}
        actionButtonText="Verify"
      />
      </div>
  );
};

export default ReportIssue;
