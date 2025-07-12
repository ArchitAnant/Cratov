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
    <div className="min-h-screen px-6 py-8 max-w-4xl mx-auto font-sans">
      <button onClick={
        () => window.history.back()
      } className="absolute left-20 top-20 "><ArrowLeft></ArrowLeft></button>
      <h1 className="text-2xl font-bold mb-6">Road Report Preview</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
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
