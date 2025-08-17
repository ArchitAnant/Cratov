import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLogin, LoginManager } from "./context/LoginContext";

import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Verify from "./pages/Verify";
import PostDetail from "./pages/PostDetail";
import BiddingDetail from "./pages/BiddingDetail";
import DownBidPage from "./pages/DownBidPage"; 
import ProjectProgress from "./pages/ProjectProgress";
import ConstructionRating from "./pages/ConstructionRating";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AgencyApproval from "./pages/AgencyApproval";
import MainLogin from "./pages/Login";
import ReportMarkdown from "./pages/Report";

import TopBar from "./components/TopBar";
import Footer from "./components/Footer";

function App() {
  return (
    <LoginManager>
      <AppContent />
    </LoginManager>
  );
}

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
        <Route path="/bidding" element={<BiddingPageRoute />} />
      
        <Route path="/down-bid" element={<DownBidPage />} /> 
        
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
  const { userType } = useLogin();
  return <BiddingDetail userRole={userType} />;
};

export default App;