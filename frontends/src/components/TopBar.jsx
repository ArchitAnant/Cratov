import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../context/LoginContext";

const TopBar = () => {
  const spacerRef = useRef();
  const [hasShadow, setHasShadow] = useState(false);
  const { setLoginState } = useLogin();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the spacer is not visible, it means something is below the TopBar
        setHasShadow(!entry.isIntersecting);
      },
      { rootMargin: "0px", threshold: 0 }
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
        className={`fixed top-0 left-0 w-full z-50 bg-white border-gray-200 transition-shadow duration-300 ${
          hasShadow ? "shadow-md" : ""
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
              className="text-[12px] font-regular text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-[12px] font-regular text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Profile
            </Link>
            <button
              onClick={() => setLoginState(false)}
              className="text-[12px] font-regular text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer right below the header */}
      <div ref={spacerRef} className="h-[1px] w-full mt-[84px]" />
    </>
  );
};

export default TopBar;
