import React from "react";
import { Home, Calendar, Camera, MessageSquare, Settings } from "lucide-react";

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="nav-bar">
      <button 
        className={`nav-item ${activeTab === "home" ? "active" : ""}`}
        onClick={() => onTabChange("home")}
        aria-label="Home Garden"
      >
        <Home />
        <span>My Garden</span>
      </button>

      <button 
        className={`nav-item ${activeTab === "tasks" ? "active" : ""}`}
        onClick={() => onTabChange("tasks")}
        aria-label="Care Schedule"
      >
        <Calendar />
        <span>Schedule</span>
      </button>

      <button 
        className={`nav-item-scan-fab ${activeTab === "scan" ? "active" : ""}`}
        onClick={() => onTabChange("scan")}
        aria-label="AI Scan Plant"
      >
        <Camera />
      </button>

      <button 
        className={`nav-item ${activeTab === "chat" ? "active" : ""}`}
        onClick={() => onTabChange("chat")}
        aria-label="AI Botanist"
      >
        <MessageSquare />
        <span>Dr. Sage</span>
      </button>

      <button 
        className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
        onClick={() => onTabChange("settings")}
        aria-label="Settings"
      >
        <Settings />
        <span>Settings</span>
      </button>
    </nav>
  );
}
