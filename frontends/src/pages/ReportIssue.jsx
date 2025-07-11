import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {GuideLineBar} from "../components/Action";
import { useUpload } from "../context/UploadContext";
import { useLogin } from "../context/LoginContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import ReportIssueForm from "../components/ReportIssueForm";


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



const ReportIssue = () => {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { userType } = useLogin();

  // Check navigation state first, then fallback to LoginContext
  // Also check if we came from agency-profile page
  const referrer = document.referrer;
  const cameFromAgencyProfile = referrer.includes('/agency-profile');

  let currentUserType = locationState.state?.userType || userType;

  // Override if we came from agency-profile
  if (cameFromAgencyProfile && !locationState.state?.userType) {
    currentUserType = "agency";
  }

  const isAgency = currentUserType === "agency";

  const { images, setImages, location, setLocation, stringLandmark, setStringLandmark  } = useUpload();
  const [address, setAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const { location: coordinate, error } = useCurrentLocation();
  // Only set location if coordinate is available and different from current
  useEffect(() => {
    if (coordinate && !location) {
    setLocation(coordinate);
  }
  }, [coordinate]);

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
    setStringLandmark(address);
    if (images.some((img) => img === null)) {
      alert("Please upload all 4 images.");
      return;
    }
    console.log("moving with coordinate", location);
    navigate("/verify", { state: { userType: currentUserType } });
  };

  return (
    <div className="font-poppins flex flex-col md:flex-row gap-8 mb-10 pt-10 min-h-screen bg-white">
      <ReportIssueForm
        isAgency={isAgency}
        address={address}
        setAddress={setAddress}
        error={error}
        location={location}
        images={images}
        handleImageUpload={handleImageUpload}
        onLocationSelect={(loc) => {
          console.log("Selected location:", loc);
          setLocation({ lat: loc.lat, lon: loc.lng });
        }}
      />
      <GuideLineBar
        onActionButtonClick={() => {
              if (!address) {
      alert("Please add an address.");
      return;
    }
    setStringLandmark(address);
    if (images.some((img) => img === null)) {
      alert("Please upload all 4 images.");
      return;
    }
    console.log("moving with coordinate", location);
    navigate("/verify", { state: { userType: currentUserType } });
        }}
        actionButtonText={isAgency ? "Verify" : "Post"}
      />
    </div>
  );
};

export default ReportIssue;
