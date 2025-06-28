import { BrowserRouter, Routes, Route } from "react-router-dom";

//  Page imports
import ReportIssue from "./pages/ReportIssue";
import Verify from "./pages/Verify";
import StatusProgress from "./pages/StatusProgress";
import PostDetail from "./pages/PostDetail";
import BiddingDetail from "./pages/BiddingDetail";
import ProjectProgress from "./pages/ProjectProgress";
import FundedDetail from "./pages/Funded"; 
import ConstructionRating from "./pages/ConstructionRating"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportIssue />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/status" element={<StatusProgress />} />
        <Route path="/PostDetail/:id" element={<PostDetail />} />
        <Route path="/bidding" element={<BiddingDetail />} />
        <Route path="/progress/:id" element={<ProjectProgress />} />
        <Route path="/funded" element={<FundedDetail />} />
        <Route path="/rate-construction" element={<ConstructionRating />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
