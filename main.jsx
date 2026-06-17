import "./storage.js"; // MUST be first: installs window.storage before the app mounts
import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
