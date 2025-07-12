import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import {getUserDetails} from "../helper"; 
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const spacerRef = useRef();
  const [hasShadow, setHasShadow] = useState(false);
  const { userAddress, setUserAddress, userType, setUserType, userName,setUserName,userUsername, setUserUsername,loginSuccesful,setLoginState} = useLogin();
  const naviagte = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the spacer is not visible, it means something is below the TopBars
        setHasShadow(!entry.isIntersecting);
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    if (spacerRef.current) {
      observer.observe(spacerRef.current);
    }

    return () => {
      if (spacerRef.current) observer.unobserve(spacerRef.current);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full bg-white border-gray-200 transition-shadow duration-300 z-30 ${
  hasShadow ? "shadow-md" : "shadow-none"
}`}
      >
        <div className="flex flex-row items-center justify-between px-10 py-6">
          <Link
            to="/home"
            className="font-medium text-[14px] tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:text-blue-600 transition-colors duration-200"
          >
            CRATOV
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-[11px] font-regular text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              
            </Link>
            <Link
              to="/profile"
              className="text-[11px] font-regular text-gray-700 hover:text-blue-600 hover:opacity-80 transition-colors duration-200"
              onClick={
                () => {
                  if (!userAddress) {
                    alert("Please connect your wallet first.");
                    return;
                  }
                  // Fetch user details when navigating to profile
                  getUserDetails(userAddress,userType).then((data) => {
                    if (data) {
                      setUserName(data.userName);
                      setUserUsername(data.userUsername);
                    } else {
                      console.error("Error fetching user details");
                    }
                  });
                }
              }
            >
              PROFILE
            </Link>
            <button
              onClick={() => {
                setLoginState(false);
                naviagte("/")
                setUserAddress(null);
                setUserType(null);
                setUserName(null);
                setUserUsername(null);
                localStorage.removeItem("userAddress");
                localStorage.removeItem("userType");
                localStorage.removeItem("userName");  
                localStorage.removeItem("userUsername");
              }}
              className="text-[11px] font-regular text-[#9D0202] hover:opacity-80 transition-colors duration-200"
            >
              LOGOUT
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer right below the header */}
      <div ref={spacerRef} className="h-[60px] w-full" />
    </>
  );
};

export default TopBar;
