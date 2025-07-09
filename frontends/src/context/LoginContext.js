// src/context/UploadContext.js
import { createContext, useContext, useState } from "react";

const LoginContext = createContext();

export const LoginManager = ({ children }) => {
    const [userAddress, setUserAddress] = useState(null);
    const [userType, setUserType] = useState("user"); // Default to "user" for testing
    const [userName, setUserName] = useState(null);
    const [userUsername, setUserUsername] = useState(null);
    const [loginSuccesful, setLoginState] = useState(false);


  return (
    <LoginContext.Provider value={{ userAddress, setUserAddress, userType, setUserType, userName,setUserName, userUsername, setUserUsername,loginSuccesful,setLoginState }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
