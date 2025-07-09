import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

const PostImageGallery = ({
  images = [],
  maxImages = 4,
  imageSize = "80px",
  showModal = true,
  className = ""
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image, index) => {
    if (showModal) {
      setSelectedImage({ src: image, index });
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const renderImage = (img, index) => (
    <div 
      key={index} 
      className={`bg-gray-200 rounded-[15px] overflow-hidden cursor-pointer
        hover:shadow-lg transition-shadow duration-200 relative group
      `}
      style={{ width: imageSize, height: imageSize }}
      onClick={() => handleImageClick(img, index)}
    >
      <img 
        src={img} 
        alt={`Post image ${index + 1}`} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div 
        className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500"
        style={{ display: 'none' }}
      >
        No Image
      </div>
      
      {/* Hover overlay */}
      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
          flex items-center justify-center transition-all duration-200">
          <ZoomIn 
            size={20} 
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
          />
        </div>
      )}
    </div>
  );

  const renderPlaceholder = (index) => (
    <div 
      key={`placeholder-${index}`}
      className="bg-gray-200 rounded-[15px] flex items-center justify-center"
      style={{ width: imageSize, height: imageSize }}
    >
      <span className="text-xs text-gray-500">No Image</span>
    </div>
  );

  return (
    <>
      <div className={`flex gap-4 ${className}`}>
        {/* Render actual images */}
        {images.slice(0, maxImages).map((img, index) => renderImage(img, index))}
        
        {/* Render placeholders for missing images */}
        {images.length < maxImages && 
          Array.from({ length: maxImages - images.length }, (_, index) => 
            renderPlaceholder(images.length + index)
          )
        }
      </div>

      {/* Modal for image preview */}
      {selectedImage && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-4xl p-4">
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            <img
              src={selectedImage.src}
              alt={`Post image ${selectedImage.index + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
              bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage.index + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostImageGallery;
