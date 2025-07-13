import {connectWallet,checkAlredyRegisted,registerNewUser} from "../helper";
import { useState } from "react";
import {DoorClosed,BrickWall,UserRound,ArrowRight} from "lucide-react"
import { useLogin } from "../context/LoginContext";
import { Button } from "../components/Action";




const MainLogin = () => {
    const [screenCount , setScreenCount] = useState(0);
    const { userAddress, setUserAddress, userType, setUserType, userName,setUserName,userUsername, setUserUsername,loginSuccesful,setLoginState} = useLogin();
    const [loading, setLoading] = useState(false);
  
    const handleRegister = () => {
        registerNewUser(userAddress, userName, userType, userUsername).then((res) => {
            if (res) {
                console.log("User registered successfully");
                setLoading(false);
                setLoginState(true);
                // Don't clear user data after successful registration
                // Keep userAddress, userType, userName, userUsername for later use
            } else {
                console.error("Error registering user");
                setLoading(false);
                setScreenCount(0);
                setUserAddress(null);
                setUserType(null);
                setUserName(null);
                setUserUsername(null);
            }
        }).catch((err) => {
            console.error("Error registering user:", err);
        });
    }


    return (
        <div className="flex flex-row items-center justify-between px-20 py-6 w-screen h-screen">
             {screenCount>0 && <div className="absolute left-10 top-10 font-medium text-[14px] tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                CRATOV
            </div>}
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
                setLoading(true);
                setUserAddress(walletInfo.userAddress);
                checkAlredyRegisted(walletInfo.userAddress, setUserType, setUserName, setUserUsername).then(async (isRegistered) => {
                    if (isRegistered) {
                        setLoginState(true);
                        setLoading(false);
                    }
                    else {
                        setScreenCount(1);
                        setLoading(false);
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
            <input type="text" placeholder="Enter your username" className="outline-none text-[46px] font-regular " value={userUsername} onChange={(e) => setUserUsername(e.target.value)}/>
            
            <button disabled={loading} onClick={() => {
                if (!userUsername || userUsername.trim() === "") {
                    alert("Please enter a valid username");
                    return;
                }
                setLoading(true);
                setUserUsername(userUsername.trim());
                handleRegister();
                
                setScreenCount(4);
            
                
            }} className={`flex flex-row items-center justify-center py-4 px-7 rounded-full ml-10 ${loading ? "opacity-50 pointer-events-none" : "hover:opacity-[0.5]"} transition-all duration-300 cursor-pointer`}>
                <ArrowRight className="size-[100px] hover:opacity-40 transition-all duration-300" strokeWidth={1}/>
            </button>
        </div>}

        {/* show loadign screen till the registeration is complete */}
        {screenCount===4 && <div className="flex flex-row items-center justify-center w-screen h-screen">
       
            <h1 className="text-[46px] font-regular bg-gradient-to-r from-black via-purple-500 to-pink-500 bg-clip-text text-transparent  bg-[length:200%_200%] animate-gradient-x">Registering</h1>
            
        </div>}

            

        </div>

    );
}

const SelectUserType = ({setUserType,setScreenCount}) => {
   
    return(
        <div className="flex flex-col items-center justify-between w-screen">
            <h1 className="text-medium text-[70px] text-black opacity-20">Who are you?</h1>
            <h1 className="text-medium text-[20px] text-black opacity-50 mt-10">Select User Type</h1>
            <div className="flex flex-row items-center justify-between mt-10 gap-8">
                <Button
                  variant="outline"
                  onClick={() => {setUserType("user");setScreenCount(2)}}
                  className="flex flex-col items-center justify-center bg-black bg-opacity-[0.05] py-8 w-[180px] h-auto rounded-[40px] hover:bg-black hover:bg-opacity-[0.1] transition-all duration-300"
                >
                    <UserRound className="w-[40px] h-[40px] text-black mb-2" strokeWidth={1}/>
                    <span className="text-[18px] font-regular opacity-60">User</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {setUserType("contractor");setScreenCount(2)}}
                  className="flex flex-col items-center justify-center bg-black bg-opacity-[0.05] py-8 w-[180px] h-auto rounded-[40px] hover:bg-black hover:bg-opacity-[0.1] transition-all duration-300"
                >
                    <BrickWall className="w-[40px] h-[40px] text-black mb-2" strokeWidth={1}/>
                    <span className="text-[18px] font-regular opacity-60">Contractor</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {setUserType("agency");setScreenCount(2)}}
                  className="flex flex-col items-center justify-center bg-black bg-opacity-[0.05] py-8 w-[180px] h-auto rounded-[40px] hover:bg-black hover:bg-opacity-[0.1] transition-all duration-300"
                >
                    <DoorClosed className="w-[40px] h-[40px] text-black mb-2" strokeWidth={1}/>
                    <span className="text-[18px] font-regular opacity-60">Agency</span>
                </Button>
            </div>
        </div>
    )
}






export default MainLogin;

