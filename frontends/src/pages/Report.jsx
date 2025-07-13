import { useEffect, useState } from "react";
import { marked } from "marked";
import {  useLocation } from "react-router-dom";
import { getReport } from "../helper";
import { ArrowLeft } from "lucide-react";
import DOMPurify from "dompurify"; // Optional for XSS protection

const ReportMarkdown = () => {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const locationState = useLocation();
  const postid = locationState.state.post.postID
  console.log(postid)

  useEffect(() => {
    console.log("Fetching report for post ID:", postid);
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await getReport(postid);
        if (response && response.report_md) {
          setMarkdown(response.report_md);
        } else {
          console.error("No report data found");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
      setLoading(false);
    };

    fetchReport();
  }, [postid]);

  return (
    <div className="min-h-screen px-6 py-8 max-w-4xl mx-auto ">
      <button onClick={
        () => window.history.back()
      } className="absolute left-20 top-20 "><ArrowLeft></ArrowLeft></button>
      <h1 className="text-2xl font-bold mb-6">Road Report Preview</h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
       <h1 className="text-[36px] font-regular bg-gradient-to-r from-black/[0.9] via-black/[0.5] to-black/[0.6] bg-clip-text text-transparent  bg-[length:200%_200%] animate-gradient-x">Loading Report</h1>
       <h1 className="text-[15px] text-black/[0.4] font-regular pt-2 ">Wait while we fetch details and generate a summary report for you!</h1>
          </div>
      ) : (
        <div
          className="prose prose-sm sm:prose lg:prose-lg max-w-none bg-white p-6 rounded-xl shadow-md"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(markdown)) }}
        />
      )}
    </div>
  );
};

export default ReportMarkdown;
