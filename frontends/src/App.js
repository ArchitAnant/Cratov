import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page imports
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Verify from "./pages/Verify";
import PostDetail from "./pages/PostDetail";
import BiddingDetail from "./pages/BiddingDetail";
import ProjectProgress from "./pages/ProjectProgress";
// import FundedDetail from "./pages/Funded"; // Commented out - will use later if needed
import ConstructionRating from "./pages/ConstructionRating";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import TopBar from "./components/TopBar";
// import AgencyProfile from "./pages/Agency-profile";
import AgencyApproval from "./pages/AgencyApproval";
import Footer from "./components/Footer";
import MainLogin from "./pages/Login";
import ReportMarkdown from "./pages/Report";
import { useLogin } from "./context/LoginContext";

function App() {
  const {loginSuccesful } = useLogin();

  return (
    <div className="App">
      {loginSuccesful  ? <MainBrowser /> : <MainLogin />}
    </div>
  );
}

const MainBrowser = () => {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<MainLogin />} />
        <Route path="/reportissue" element={<ReportIssue />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/postdetail" element={<PostDetail />} />
        <Route path="/bidding" element={<BiddingDetail />} />
        <Route path="/progress/:id" element={<ProjectProgress />} />
        {/* <Route path="/funded" element={<FundedDetail />} /> */} {/* Commented out - will use later if needed */}
        <Route path="/rate-construction" element={<ConstructionRating />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/agency-profile" element={<AgencyProfile />} /> */}
        <Route path="/showReport" element={<ReportMarkdown />} />
        <Route path="/agency-approval" element={<AgencyApproval />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
