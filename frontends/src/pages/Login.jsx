import {connectWallet,checkAlredyRegisted} from "../helper";
import { useState } from "react";
import {DoorClosed,BrickWall,UserRound,ArrowRight} from "lucide-react"
import { useLogin } from "../context/LoginContext";



const MainLogin = () => {
    const [screenCount , setScreenCount] = useState(0);
    const { userAddress, setUserAddress, userType, setUserType, userName,setUserName,userUsername, setUserUsername,loginSuccesful,setLoginState} = useLogin();
    
    return (
        <div className="flex flex-row items-center justify-between px-20 py-6 w-screen h-screen">
            {screenCount===0&&<>
            
                    <div className="absolute left-[150px] flex flex-col space-y-[-10px]">
            <div className=" font-medium text-[50px] tracking-wide opacity-[0.55] bg-gradient-to-t from-gray-400 to-white bg-clip-text text-transparent">
                CRATOV
            </div>
            <div className=" font-medium text-[50px] tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                CRATOV
            </div>
            <div className=" font-medium text-[50px] tracking-wide opacity-[0.55] bg-gradient-to-b from-gray-400  to-white bg-clip-text text-transparent">
                CRATOV
            </div>
            
        </div>

        <button onClick={async () => {
            const walletInfo = await connectWallet();
            if (walletInfo) {
                // Do something with walletInfo.provider, walletInfo.signer, walletInfo.userAddress
                console.log("Connected:", walletInfo.userAddress);
                setUserAddress(walletInfo.userAddress);
                checkAlredyRegisted(walletInfo.userAddress).then((isRegistered) => {
                    if (isRegistered) {
                        setLoginState(true);
                        console.log("User is already registered");  
                    }
                    else {
                        setScreenCount(1);
                    }
                });
            }}} className="absolute right-[150px] flex flex-row items-center justify-center gap-4 bg-black bg-opacity-[0.07] py-4 px-7 rounded-full">
            <img src="/MetaMaskLogo.svg" alt="Login" className="w-9 object-cover" />
            <h1 className="text-[14px] font-medium">Connect with Metamask</h1>
        </button>

        </>}
        {screenCount===1 && <SelectUserType setUserType={setUserType} setScreenCount={setScreenCount}/>}
        {screenCount===2 && <div className="flex flex-row items-center justify-center w-screen h-screen">
            <input type="text" placeholder="Enter your name" className="outline-none text-[46px] font-regular" value={userName} onChange={(e) => setUserName(e.target.value)}/>
            
            <button onClick={() => {
                if (!userName || userName.trim() === "") {
                    alert("Please enter a valid name");
                    return;
                }
                setUserName(userName.trim());setScreenCount(3)
                
                }} className="flex flex-row items-center justify-center py-4 px-7 rounded-full ml-10  hover:opacity-[0.5] transition-all duration-300 cursor-pointer">
                <ArrowRight className="size-[100px] hover:opacity-40 transition-all duration-300" strokeWidth={1}/>
            </button>
        </div>}
        {screenCount===3 && <div className="flex flex-row items-center justify-center w-screen h-screen">
            <input type="text" placeholder="Enter your username" className="outline-none text-[46px] font-regular" value={userUsername} onChange={(e) => setUserUsername(e.target.value)}/>
            
            <button onClick={() => {
                if (!userUsername || userUsername.trim() === "") {
                    alert("Please enter a valid username");
                    return;
                }
                
                setUserName(userUsername.trim());
                setScreenCount(3);
                setLoginState(true);
                console.log("userAddress", userAddress);
                console.log("userType", userType);
                console.log("userName", userName);
                console.log("userUsername", userUsername);
            }} className="flex flex-row items-center justify-center py-4 px-7 rounded-full ml-10  hover:opacity-[0.5] transition-all duration-300 cursor-pointer">
                <ArrowRight className="size-[100px] hover:opacity-40 transition-all duration-300" strokeWidth={1}/>
            </button>
        </div>}
            

        </div>

    );
}

const SelectUserType = ({setUserType,setScreenCount}) => {
   
    return(
        <div className="flex flex-col items-center justify-between w-screen">
            <h1 className="text-medium text-[70px] text-black opacity-10">Who are you?</h1>
            <h1 className="text-medium text-[20px] text-black opacity-50 mt-10">Select User Type</h1>
            <div className="flex flex-row items-center justify-between mt-10 gap-8">
                <button onClick={() => {setUserType("user");setScreenCount(2)}} className="flex flex-col items-center justify-center bg-black bg-opacity-[0.05] py-8 w-[180px] rounded-[40px] hover:bg-black hover:bg-opacity-[0.1] transition-all duration-300 cursor-pointer">
                    <UserRound className="w-[40px] h-[40px] text-black" strokeWidth={1}/>
                    <h1 className="text-[18px] font-regular mt-1 opacity-60">User</h1>
                </button>
                <button onClick={() => {setUserType("contractor");setScreenCount(2)}} className="flex flex-col items-center justify-center bg-black bg-opacity-[0.05] py-8 w-[180px] rounded-[40px] hover:bg-black hover:bg-opacity-[0.1] transition-all duration-300 cursor-pointer">
                    <BrickWall className="w-[40px] h-[40px] text-black " strokeWidth={1}/>
                    <h1 className="text-[18px] font-regular mt-1 opacity-60">Contractor</h1>
                </button>
                <button onClick={() => {setUserType("agency");setScreenCount(2)}} className="flex flex-col items-center justify-center bg-black bg-opacity-[0.05] py-8 w-[180px] rounded-[40px] hover:bg-black hover:bg-opacity-[0.1] transition-all duration-300 cursor-pointer">
                    <DoorClosed className="w-[40px] h-[40px] text-black " strokeWidth={1}/>
                    <h1 className="text-[18px] font-regular mt-1 opacity-60">Agency</h1>
                </button>
                
            </div>
        </div>
    )
}






export default MainLogin;

