import { ArrowRight, Plus } from "lucide-react";

/**
 * Standardized Button Component
 * Supports all button variants used across the app
 */
export const Button = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  disabled = false,
  className = "",
  showArrow = false,
  icon = null,
  ...props
}) => {
  const baseStyles = "flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer";

  const variants = {
    // Primary black button (ActionButton style)
    primary: "bg-black text-white hover:bg-gray-800",

    // Secondary gray button (Profile buttons style)
    secondary: "bg-gray-100 text-black hover:bg-gray-200 shadow-md",

    // Upvote button style
    upvote: "bg-[#D9D9D9] text-black hover:bg-gray-300",

    // Verify button style (green)
    verify: "bg-green-600 text-white hover:bg-green-700",

    // Outline button
    outline: "border border-gray-300 text-black hover:bg-gray-50"
  };

  const sizes = {
    // Small buttons (StatusCard expand)
    small: "w-[100px] h-[32px] text-[12px] rounded-[20px]",

    // Medium buttons (ActionButton standard)
    medium: "w-[137px] h-[40px] text-[13px] rounded-[49px]",

    // Large buttons (PostDetail upvote/verify)
    large: "w-[146px] h-[56px] text-[16px] rounded-[49px]",

    // Profile buttons (UserProfileCard)
    profile: "w-full h-12 text-[14px] rounded-xl px-4 justify-start",

    // Auto size
    auto: "px-4 py-2 text-[14px] rounded-[20px]"
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "opacity-100";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="text-lg mr-2">{icon}</span>}
      {children}
      {showArrow && <ArrowRight size={16} strokeWidth={2.5} />}
    </button>
  );
};

// ActionButton (existing component compatibility)
export const ActionButton = ({ onClick, action, ifDisable = false }) => (
  <Button
    variant="primary"
    size="medium"
    onClick={onClick}
    disabled={ifDisable}
    showArrow={true}
  >
    {action}
  </Button>
);

/**
 * Image Gallery Component
 * Used for displaying uploaded images in PostDetail
 */
export const ImageGallery = ({
  images = [],
  size = "medium",
  className = ""
}) => {
  const sizes = {
    small: "w-[60px] h-[60px] rounded-[15px]",
    medium: "w-[80px] h-[80px] rounded-[20px]",
    large: "w-[100px] h-[100px] rounded-[25px]"
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      {images && images.length > 0 ? (
        images.map((img, i) => (
          <div key={i} className={`${sizes[size]} bg-gray-200 overflow-hidden`}>
            {img && (
              <img
                src={img}
                alt={`uploaded-${i}`}
                className={`w-full h-full object-cover ${sizes[size].split(' ')[2]}`}
              />
            )}
          </div>
        ))
      ) : (
        [1, 2, 3, 4].map((i) => (
          <div key={i} className={`${sizes[size]} bg-gray-200`} />
        ))
      )}
    </div>
  );
};

/**
 * Image Upload Component
 * Used for pothole image uploads in ReportIssue form
 */
export const ImageUpload = ({
  images = [],
  onImageUpload,
  maxImages = 4,
  size = "large",
  className = ""
}) => {
  const sizes = {
    small: "w-[80px] h-[80px] rounded-[15px]",
    medium: "w-[100px] h-[100px] rounded-[18px]",
    large: "w-[114px] h-[114px] rounded-[21px]"
  };

  return (
    <div className={`flex gap-4 flex-wrap ${className}`}>
      {Array.from({ length: maxImages }).map((_, index) => {
        const img = images[index];
        return (
          <label
            key={index}
            className={`${sizes[size]} flex items-center justify-center bg-black cursor-pointer ${
              !img ? "bg-opacity-10" : "bg-opacity-100 border border-black"
            }`}
          >
            {img ? (
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className={`w-full h-full object-cover ${sizes[size].split(' ')[2]}`}
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
              onChange={(e) => onImageUpload(index, e)}
            />
          </label>
        );
      })}
    </div>
  );
};

export const GuideLineBar = ({onActionButtonClick,actionButtonText,buttonDisable}) => {
    return (
        <div className="fixed top-24 right-0 h-full w-full md:w-[30%] pr-[86px] me-5 overflow-y-auto ">
        <div className="mb-8">
          <h4 className="font-medium text-lg mb-10">Guidelines :</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ms-2">
            <li>Add the location properly</li>
            <li>Make sure the images are clear and show the entire potholes</li>
            <li>You need to upload all 4 images.</li>
          </ul>
        </div>

        <div className="mb-20">
          <h4 className="font-medium text-lg mb-8">Cautions :</h4>
          <p className="text-sm text-gray-700 ms-2">
            Don’t upload unwanted images or misleading information. Uploading
            such images would lead to account termination.
          </p>
        </div>
        <div className="pt-10"></div>
        <div >
        <ActionButton onClick={onActionButtonClick} action={actionButtonText} ifDisable={buttonDisable} />
        </div>
      </div>
    )
}