import { ArrowRight } from "lucide-react";

const ActionButton = ({onClick, action,ifDisable}) => {
    return (
        <button
          disabled = {ifDisable}
          onClick={onClick}
          className={`flex items-center justify-center gap-2 
            w-[137px] h-[40px] rounded-[49px] 
            bg-black text-white text-[13px]
            hover:bg-gray-800 ${ifDisable ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"}`}
        >
          {action} 
         <ArrowRight size={16} strokeWidth={2.5} />
        </button>
    )
}

const GuideLineBar = ({onActionButtonClick,actionButtonText,buttonDisable}) => {
    return (
        <div className="w-full md:w-[30%] pr-[86px] me-5">
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




export default GuideLineBar;