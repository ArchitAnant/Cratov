import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="flex flex-row items-center justify-between px-10 py-4">
        <Link to="/home" className="font-bold text-[20px] tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:text-blue-600 transition-colors duration-200">
          CRATOV
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/dashboard" className="text-[14px] font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
          <Link to="/profile" className="text-[14px] font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">Profile</Link>
        </nav>
      </div>
    </header>
  );
};

export default TopBar;