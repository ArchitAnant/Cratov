// import { useNavigate } from "react-router-dom";

const TopBar = ()=>{
    // var navigate = useNavigate();
    return (
        <div className="fixed flex flex-row w-full px-10 pt-[30px] pb-[20px] mb-5 bg-white">
        <h1 className="font-medium text-[14px] cursor-pointer">CRATOV</h1>
        <div className="flex-grow"></div>
        <h1 className="font-regular text-[12px] cursor-pointer">PORFILE</h1>
        </div>
    );
}

export default TopBar;