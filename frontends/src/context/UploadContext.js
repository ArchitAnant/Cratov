// src/context/UploadContext.js
import { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [location, setLocation] = useState(null);
  const [stringLandmark, setStringLandmark] = useState("");
  const [roadCondtion, setRoadCondition] = useState("");


  return (
    <UploadContext.Provider value={{ images, setImages, location, setLocation, stringLandmark, setStringLandmark, roadCondtion, setRoadCondition }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
