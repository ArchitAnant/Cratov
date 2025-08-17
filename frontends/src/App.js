import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLogin, LoginManager } from "./context/LoginContext"; // LoginManager ko import karein

// Page imports
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Verify from "./pages/Verify";
import PostDetail from "./pages/PostDetail";
import BiddingDetail from "./pages/BiddingDetail";
import ProjectProgress from "./pages/ProjectProgress";
import ConstructionRating from "./pages/ConstructionRating";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AgencyApproval from "./pages/AgencyApproval";
import MainLogin from "./pages/Login";
import ReportMarkdown from "./pages/Report";

// Component imports
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";

// Wrapper component to provide context to the entire app
function App() {
  return (
    <LoginManager>
      <AppContent />
    </LoginManager>
  );
}

// This component now has access to the LoginContext
const AppContent = () => {
  const { loginSuccesful } = useLogin();

  return (
    <div className="App">
      <BrowserRouter>
        {loginSuccesful ? <MainBrowser /> : <MainLogin />}
      </BrowserRouter>
    </div>
  );
};

// Main application routes after login
const MainBrowser = () => {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reportissue" element={<ReportIssue />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/postdetail" element={<PostDetail />} />
        
        {/* Yahan par BiddingPageRoute ka istemal kiya gaya hai */}
        <Route path="/bidding" element={<BiddingPageRoute />} />
        
        <Route path="/progress/:id" element={<ProjectProgress />} />
        <Route path="/rate-construction" element={<ConstructionRating />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/showReport" element={<ReportMarkdown />} />
        <Route path="/agency-approval" element={<AgencyApproval />} />
      </Routes>
      <Footer />
    </>
  );
};

// Helper component to pass the userRole prop to BiddingDetail
const BiddingPageRoute = () => {
  const { userType } = useLogin(); // Context se userType nikalein
  
  // userType ko userRole prop mein pass karein
  return <BiddingDetail userRole={userType} />;
};

export default App;