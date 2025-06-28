import { useEffect, useState } from "react";

const StatusProgress = () => {
  const [upload, setUpload] = useState(0);
  const [validate, setValidate] = useState(0);
  const [complete, setComplete] = useState(0);
  const [fail, setFail] = useState(0);

  // Upload Progress (Stops at 30%)
  useEffect(() => {
    const uploadTimer = setInterval(() => {
      setUpload((prev) => {
        if (prev >= 30) {
          clearInterval(uploadTimer);
          return 30;
        }
        return prev + 5;
      });
    }, 300);

    return () => clearInterval(uploadTimer);
  }, []);

  // Validate Progress (Starts after Upload & Stops at 80%)
  useEffect(() => {
    if (upload === 30) {
      const validateTimer = setInterval(() => {
        setValidate((prev) => {
          if (prev >= 80) {
            clearInterval(validateTimer);
            return 80;
          }
          return prev + 8;
        });
      }, 300);

      return () => clearInterval(validateTimer);
    }
  }, [upload]);

  // Completed Animation (Fills to 100%)
  useEffect(() => {
    if (validate === 80) {
      const completeTimer = setInterval(() => {
        setComplete((prev) => {
          if (prev >= 100) {
            clearInterval(completeTimer);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(completeTimer);
    }
  }, [validate]);

  // Failed Animation (Fills to 100%)
  useEffect(() => {
    if (complete === 100) {
      const failTimer = setInterval(() => {
        setFail((prev) => {
          if (prev >= 100) {
            clearInterval(failTimer);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(failTimer);
    }
  }, [complete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-8">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg flex flex-col gap-8">

        {/* Upload Progress */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Uploading</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-black h-4 rounded-full transition-all duration-500"
              style={{ width: `${upload}%` }}
            ></div>
          </div>
        </div>

        {/* Validate Progress */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Validating</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-black h-4 rounded-full transition-all duration-500"
              style={{ width: `${validate}%` }}
            ></div>
          </div>
        </div>

        {/* Completed Progress */}
        <div>
          <p className="text-sm font-medium text-green-700 mb-2">Completed</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${complete}%` }}
            ></div>
          </div>
        </div>

        {/* Failed Progress */}
        <div>
          <p className="text-sm font-medium text-red-600 mb-2">Failed</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-red-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${fail}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatusProgress;
