// src/context/UploadContext.js
import { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [images, setImages] = useState([null, null, null, null]);

  return (
    <UploadContext.Provider value={{ images, setImages }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
