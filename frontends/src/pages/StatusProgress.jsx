import { useEffect, useState } from "react";

const StatusProgress = () => {
  const [upload, setUpload] = useState(0);
  const [validate, setValidate] = useState(0);
  const [status, setStatus] = useState("processing"); // 'processing' | 'completed' | 'failed'

  // Upload progress
  useEffect(() => {
    const uploadTimer = setInterval(() => {
      setUpload((prev) => {
        if (prev >= 100) {
          clearInterval(uploadTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(uploadTimer);
  }, []);

  // Validate progress after uploading
  useEffect(() => {
    if (upload === 100) {
      const validateTimer = setInterval(() => {
        setValidate((prev) => {
          if (prev >= 100) {
            clearInterval(validateTimer);
            // Change status based on your need
            setStatus("completed"); //  change to 'failed' to test failure
            return 100;
          }
          return prev + 15;
        });
      }, 300);

      return () => clearInterval(validateTimer);
    }
  }, [upload]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-8">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
       
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">Uploading</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-black h-3 rounded-full transition-all duration-500"
              style={{ width: `${upload}%` }}
            ></div>
          </div>
        </div>

       
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">Validating</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-black h-3 rounded-full transition-all duration-500"
              style={{ width: `${validate}%` }}
            ></div>
          </div>
        </div>

       
        {status === "completed" && (
          <div className="mb-6">
            <p className="text-sm text-green-700 mb-2">Completed</p>
            <div className="w-full bg-green-600 rounded-full h-3"></div>
          </div>
        )}

       
        {status === "failed" && (
          <div className="">
            <p className="text-sm text-red-600 mb-2">Failed</p>
            <div className="w-full bg-red-600 rounded-full h-3"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusProgress;
