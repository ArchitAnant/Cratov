import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UploadProvider } from "./context/UploadContext";
import { LoginManager } from "./context/LoginContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoginManager>
    <UploadProvider>
    <App />
    </UploadProvider>
    </LoginManager>
  </React.StrictMode>
);
