import { Plus, Minus, ChevronRight } from "lucide-react";

const ExpandableFormSection = ({
  title,
  isExpanded,
  onToggle,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength = 500,
  colorTheme = "blue", // blue, green, purple, orange, red
  required = false,
  disabled = false
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
      border: "border-blue-100",
      icon: "bg-blue-100 text-blue-600",
      focus: "focus:ring-blue-500 focus:border-blue-500"
    },
    green: {
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      border: "border-green-100",
      icon: "bg-green-100 text-green-600",
      focus: "focus:ring-green-500 focus:border-green-500"
    },
    purple: {
      bg: "bg-gradient-to-r from-purple-50 to-violet-50",
      border: "border-purple-100",
      icon: "bg-purple-100 text-purple-600",
      focus: "focus:ring-purple-500 focus:border-purple-500"
    },
    orange: {
      bg: "bg-gradient-to-r from-orange-50 to-amber-50",
      border: "border-orange-100",
      icon: "bg-orange-100 text-orange-600",
      focus: "focus:ring-orange-500 focus:border-orange-500"
    },
    red: {
      bg: "bg-gradient-to-r from-red-50 to-pink-50",
      border: "border-red-100",
      icon: "bg-red-100 text-red-600",
      focus: "focus:ring-red-500 focus:border-red-500"
    }
  };

  const theme = colorClasses[colorTheme] || colorClasses.blue;

  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      {/* Header Button */}
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`flex items-center justify-between w-full text-left p-4 
          hover:bg-gray-50 transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.icon}`}>
            {isExpanded ? (
              <Minus size={16} />
            ) : (
              <Plus size={16} />
            )}
          </div>
          <span className="text-[16px] font-medium text-gray-800">
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        <ChevronRight 
          size={20} 
          className={`text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`} 
        />
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className={`p-6 ${theme.bg} ${theme.border}`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {title} Details
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            className={`w-full p-4 border-2 border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 ${theme.focus}
              transition-all duration-200 resize-none shadow-sm
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
          />
          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {value.length}/{maxLength} characters
            </div>
            {required && value.trim() === "" && (
              <div className="text-xs text-red-500">
                This field is required
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableFormSection;
