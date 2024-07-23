import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const DOMRoot = document.getElementById("root");

if (DOMRoot) {
  const root = ReactDOM.createRoot(DOMRoot);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

reportWebVitals();
