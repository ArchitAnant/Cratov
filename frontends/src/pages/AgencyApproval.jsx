import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionButton } from "../components/Action";
import { getPostData } from "../context/post";
import { useLogin } from "../context/LoginContext";
import ExpandableFormSection from "../components/ExpandableFormSection";
import PostInfoCard from "../components/PostInfoCard";
import PostImageGallery from "../components/PostImageGallery";

const AgencyApproval = () => {
  // Boolean variables for user type based UI flow
  const { userType } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAgency = userType === "agency" || location.state?.userType === "agency";
  const isUser = userType === "user" || location.state?.userType === "user";
  const isContractor = userType === "contractor" || location.state?.userType === "contractor";

  // Form sections configuration
  const formSections = [
    {
      id: "roadLength",
      title: "Road Length",
      placeholder: "Enter detailed road length measurements, specifications, and analysis...",
      colorTheme: "blue",
      rows: 4,
      maxLength: 500
    },
    {
      id: "roadWidth", 
      title: "Road Width",
      placeholder: "Enter road width measurements, lane specifications, and width analysis...",
      colorTheme: "green",
      rows: 4,
      maxLength: 500
    },
    {
      id: "maintenanceHistory",
      title: "Maintenance History", 
      placeholder: "Enter previous maintenance records, repair history, and timeline details...",
      colorTheme: "purple",
      rows: 4,
      maxLength: 500
    },
    {
      id: "roadSurface",
      title: "Road Surface",
      placeholder: "Enter road surface condition, material type, wear analysis, and surface quality details...",
      colorTheme: "orange", 
      rows: 4,
      maxLength: 500
    },
    {
      id: "roadGeometry",
      title: "Road Geometry",
      placeholder: "Enter comprehensive road geometry details including width, length, maintenance, history, road_surface, road_geometry, road_safety, features, POI, ROI, BRD_deflection...",
      colorTheme: "red",
      rows: 5,
      maxLength: 800
    }
  ];

  const [expandedSections, setExpandedSections] = useState(
    formSections.reduce((acc, section) => ({ ...acc, [section.id]: false }), {})
  );

  const [formData, setFormData] = useState(
    formSections.reduce((acc, section) => ({ ...acc, [section.id]: "" }), {})
  );

  const [postData, setPostData] = useState({
    address: "",
    images: [],
    coordinates: { lat: "", lon: "" }
  });

  useEffect(() => {
    // Get real post data from localStorage
    const savedPostData = getPostData();
    if (savedPostData) {
      setPostData({
        address: savedPostData.address || "Address not available",
        images: savedPostData.images || [],
        coordinates: {
          lat: savedPostData.coordinates?.lat || "Not available",
          lon: savedPostData.coordinates?.lon || "Not available"
        }
      });
    }
  }, []);

  // Reusable handlers
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormComplete = () => {
    return Object.values(formData).every(value => value.trim() !== "");
  };

  const handleConfirm = () => {
    if (isFormComplete()) {
      alert(`Post confirmed successfully by ${userType}!`);
      // Navigate based on user type
      if (isAgency) {
        navigate("/agency-profile");
      } else if (isContractor) {
        navigate("/contractor-profile");
      } else {
        navigate("/profile");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-poppins pt-24">
      <div className="flex flex-col lg:flex-row gap-8 p-8">
        {/* Left Section - Approval Details */}
        <div className="flex-1">
          <h2 className="text-[20px] font-semibold mb-6">
            {isAgency ? "Agency Approval" : isContractor ? "Contractor Review" : "Post Review"}
          </h2>
          
          {/* Address Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Location:</h3>
            <p className="text-[14px] text-gray-700">
              {postData.address || "Address not available"}
            </p>
            
            {/* Coordinates */}
            <div className="mt-3 text-[12px] text-gray-600">
              <p>Latitude: {postData.coordinates.lat}</p>
              <p>Longitude: {postData.coordinates.lon}</p>
            </div>
          </div>

          {/* Standardized Image Gallery */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Post Images:</h3>
            <PostImageGallery 
              images={postData.images}
              maxImages={4}
              imageSize="80px"
              showModal={true}
            />
          </div>

          {/* Standardized Form Sections */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {isAgency ? "Technical Assessment Forms" : "Review Forms"}
            </h3>
            
            {formSections.map((section) => (
              <ExpandableFormSection
                key={section.id}
                title={section.title}
                isExpanded={expandedSections[section.id]}
                onToggle={() => toggleSection(section.id)}
                value={formData[section.id]}
                onChange={(value) => handleInputChange(section.id, value)}
                placeholder={section.placeholder}
                rows={section.rows}
                maxLength={section.maxLength}
                colorTheme={section.colorTheme}
                required={isAgency} // Only required for agency users
                disabled={!isAgency && !isContractor} // Disable for regular users
              />
            ))}
          </div>
        </div>

        {/* Right Section - Standardized Post Info */}
        <PostInfoCard
          title={isAgency ? "Post Approval Details" : "Post Information"}
          submittedBy={{
            name: postData.submittedBy || "ari_archit_",
            avatar: postData.avatar || "https://i.ibb.co/Gt47sS0/avatar.png"
          }}
          submittedOn={postData.submittedOn || new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
          reportStatus={isAgency ? "Pre-Repair Report is awaiting the Agency Approval" : "Pre-Repair Report is awaiting the Approval"}
          showBookmark={true}
        >
          {/* Conditional Action Button based on user type */}
          {isAgency && (
            <ActionButton
              onClick={handleConfirm}
              action="Confirm"
              ifDisable={!isFormComplete()}
            />
          )}

          {isContractor && (
            <ActionButton
              onClick={handleConfirm}
              action="Confirm"
              ifDisable={!isFormComplete()}
            />
          )}
          
          {isUser && (
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
              This page is for agency/contractor review only.
            </div>
          )}
        </PostInfoCard>
      </div>
    </div>
  );
};

export default AgencyApproval;
