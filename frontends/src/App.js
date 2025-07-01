import { BrowserRouter, Routes, Route } from "react-router-dom";

//  Page imports

import ReportIssue from "./pages/ReportIssue";
import Verify from "./pages/Verify";
import PostDetail from "./pages/PostDetail";
import BiddingDetail from "./pages/BiddingDetail";
import ProjectProgress from "./pages/ProjectProgress";
import FundedDetail from "./pages/Funded"; 
import ConstructionRating from "./pages/ConstructionRating"; 
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportIssue />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/postdetail" element={<PostDetail />} />
        <Route path="/bidding" element={<BiddingDetail />} />
        <Route path="/progress/:id" element={<ProjectProgress />} />
        <Route path="/funded" element={<FundedDetail />} />
        <Route path="/rate-construction" element={<ConstructionRating />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
