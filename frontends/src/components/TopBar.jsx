// import { useNavigate } from "react-router-dom";

const TopBar = ()=>{
    // var navigate = useNavigate();
    return (
        <div className="fixed flex flex-row w-full px-10 h-20 pb-[20px] mb-5 bg-white z-10">
        <h1 className="font-medium text-[14px] cursor-pointer pt-10">CRATOV</h1>
        <div className="flex-grow"></div>
        <h1 className="font-regular text-[12px] cursor-pointer pt-10">PORFILE</h1>
        </div>
    );
}

export default TopBar;