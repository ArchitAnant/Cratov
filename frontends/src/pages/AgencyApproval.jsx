import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionButton } from "../components/Action";
import { getPostData, savePostData } from "../context/post";
import { useLogin } from "../context/LoginContext";
import ExpandableFormSection from "../components/ExpandableFormSection";
import PostInfoCard from "../components/PostInfoCard";
import PostImageGallery from "../components/PostImageGallery";
import MapSelector from "../components/MapSelector";
import { updatePostCondition,uploadApprovalData } from "../helper";

const AgencyApproval = () => {
  // Boolean variables for user type based UI flow
  const { userType } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading,seLoading] = useState(false);
  const isAgency = userType === "agency" || location.state?.userType === "agency";
  const isUser = userType === "user" || location.state?.userType === "user";
  const isContractor = userType === "contractor" || location.state?.userType === "contractor";

  // Form sections configuration
  const formSections = [
    // String fields
    {
      id: "roadDimensions",
      title: "Road Length & Width",
      type: "string",
      placeholder: "Enter road length and width measurements...",
      colorTheme: "blue",
      rows: 3,
      maxLength: 300
    },
    {
      id: "maintenanceHistory",
      title: "Maintenance History",
      type: "string",
      placeholder: "Enter maintenance records and history...",
      colorTheme: "purple",
      rows: 3,
      maxLength: 300
    },
    {
      id: "roadSurface",
      title: "Road Surface",
      type: "string",
      placeholder: "Enter road surface condition details...",
      colorTheme: "orange",
      rows: 3,
      maxLength: 300
    },
    {
      id: "roadGeometry",
      title: "Road Geometry",
      type: "string",
      placeholder: "Enter road geometry specifications...",
      colorTheme: "red",
      rows: 3,
      maxLength: 300
    },
    {
      id: "safetyFeature",
      title: "Safety Feature",
      type: "string",
      placeholder: "Enter safety features and requirements...",
      colorTheme: "blue",
      rows: 3,
      maxLength: 300
    },
    // Integer field
    {
      id: "pci",
      title: "PCI (Pavement Condition Index)",
      type: "integer",
      placeholder: "Enter PCI value (0-100)",
      colorTheme: "green",
      rows: 1,
      maxLength: 3
    },
    // Decimal fields
    {
      id: "rqi",
      title: "RQI (Ride Quality Index)",
      type: "decimal",
      placeholder: "Enter RQI value (decimal)",
      colorTheme: "purple",
      rows: 1,
      maxLength: 10
    },
    {
      id: "bbd",
      title: "BBD (Benkelman Beam Deflection)",
      type: "decimal",
      placeholder: "Enter BBD value (decimal)",
      colorTheme: "orange",
      rows: 1,
      maxLength: 10
    },
    // Max Bid Amount
    {
      id: "maxBidAmount",
      title: "Max Bid Amount",
      type: "decimal",
      placeholder: "Enter maximum bid amount (₹)",
      colorTheme: "red",
      rows: 1,
      maxLength: 15
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
        postid : savedPostData.post_id || "",
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
      seLoading(true);
      // console.log(formData)
      const postid = postData.postid || "default-post-id";
      const payload = {
        postID : postid,
        lat : postData.coordinates.lat,
        lon : postData.coordinates.lon,
        ...formData
      }
      uploadApprovalData(payload).then((response) => {
        if (response.success) {
          updatePostCondition(postid, "On Bid")
        const savedPostData = getPostData();
        if (savedPostData) {
          savePostData({
            ...savedPostData,
            status: "On Bid",
            road_condition: "",
            agency_approved: true,
            stage: 1 // Set to stage 1 (Approved + On Bid)
          });
        }
        seLoading(false);

        // Navigate to BiddingDetail page
        navigate("/home", {
          state: {
            userType: "agency",
            fromAgencyApproval: true,
            stage: 1
          }
        });
        } else {
          console.error("Failed to upload approval data:", response.error);
          seLoading(false);
        }
      });
      
    }
  };

  return (
    <div className="min-h-screen max-w-[600px] bg-white font-poppins ps-10">
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

          {/* Map Display */}
          {postData.coordinates.lat && postData.coordinates.lon && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Location Map:</h3>
              <MapSelector
                location={{
                  lat: parseFloat(postData.coordinates.lat) || 22.5726,
                  lon: parseFloat(postData.coordinates.lon) || 88.3639
                }}
                onLocationSelect={() => {}} // Read-only map for approval
              />
            </div>
          )}

          {/* Standardized Image Gallery */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Post Images:</h3>
            <PostImageGallery
              images={postData.images}
              maxImages={4}
              imageSize="114px"
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
                type={section.type} // Pass input type for validation
                required={isAgency} // Only required for agency users
                disabled={!isAgency && !isContractor} // Disable for regular users
              />
            ))}
          </div>
        </div>

        {/* Right Section - Standardized Post Info */}
        <PostInfoCard
          title={isAgency ? "About the post :" : "Post Information"}
          submittedBy={{
            name: "ari_archit_",
            avatar: "https://via.placeholder.com/40x40/000000/FFFFFF?text=U"
          }}
          submittedOn={new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
          reportStatus={isAgency ? "" : "Pre-Repair Report is awaiting the Approval"}
          showBookmark={true}
        >
          {/* Conditional Action Button based on user type */}
          {isAgency && (
            <ActionButton
              onClick={handleConfirm}
              action="Confirm"
              ifDisable={!isFormComplete()||loading}
            />
          )}

          {isContractor && (
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
              This page is for agency/contractor review only.
            </div>
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
