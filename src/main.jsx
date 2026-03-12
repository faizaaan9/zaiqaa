import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-center" toastOptions={{
          style: { fontFamily:"'Plus Jakarta Sans',sans-serif", borderRadius:"14px", background:"#14402a", color:"#fff", fontSize:"13px", border:"1px solid rgba(232,168,0,0.3)" },
          success: { iconTheme: { primary:"#e8a800", secondary:"#14402a" } },
        }} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
