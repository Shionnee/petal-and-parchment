import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, HelpCircle, RefreshCw, Trash2, Info } from "lucide-react";
import { getMockDiagnosis } from "../utils/plantDatabase";

export default function Settings({ apiKey, onSaveApiKey, onClearApiKey, onHydrateGarden, theme, onToggleTheme, layoutMode = "mobile", onToggleLayoutMode }) {
  const [keyInput, setKeyInput] = useState(apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [successAlert, setSuccessAlert] = useState("");

  const handleSave = () => {
    if (!keyInput.trim()) return;
    onSaveApiKey(keyInput.trim());
    setSuccessAlert("Gemini API Key successfully updated!");
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  const handleClear = () => {
    onClearApiKey();
    setKeyInput("");
    setSuccessAlert("Gemini API Key successfully cleared. Simulation mode active.");
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  // Pre-populate garden with rich data for testing
  const handleHydrate = () => {
    // Generate three interesting diagnostic profiles
    const plant1 = getMockDiagnosis("monstera", "overwatered");
    const plant2 = getMockDiagnosis("fiddle_leaf", "healthy");
    const plant3 = getMockDiagnosis("peace_lily", "underwatered_dramatic");

    // Add high resolution custom pictures
    plant1.image = "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80";
    plant2.image = "https://images.unsplash.com/photo-1597055181300-e3633a207518?w=600&auto=format&fit=crop&q=80";
    plant3.image = "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80";

    onHydrateGarden([plant1, plant2, plant3]);
    setSuccessAlert("Garden populated with 3 diagnostic plant profiles!");
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  return (
    <div className="screen-container">
      {/* Whimsical Brand Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "24px", marginTop: "10px" }}>
        <div style={{ width: "76px", height: "76px", borderRadius: "50%", overflow: "hidden", border: "1.5px solid var(--primary)", padding: "2px", background: "var(--bg-card)", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "var(--shadow-md)", transition: "transform var(--t-fast)" }}>
          <img src="/logo.png" alt="Petal & Parchment Logo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
        </div>
        <h2 style={{ fontSize: "24px", fontFamily: "var(--font-header)", fontWeight: "400", marginTop: "12px", color: "var(--text-main)" }}>
          Petal & Parchment
        </h2>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-muted)", marginTop: "2px", fontWeight: "700" }}>
          conservatory management
        </p>
      </div>

      {/* Visual Theme Selection Widget */}
      <div className="glass-card" style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "14.5px", marginBottom: "6px", color: "var(--primary)" }}>App Visual Theme</h3>
        <p style={{ fontSize: "12px", marginBottom: "14px", lineHeight: "1.45", color: "var(--text-sub)" }}>
          Toggle between the light forest fairy morning aesthetic and the dark mystical night forest theme.
        </p>
        <div style={{ 
          display: "flex", 
          background: "rgba(74, 114, 94, 0.04)", 
          borderRadius: "99px", 
          padding: "4px", 
          border: "1px solid var(--border-glass)"
        }}>
          <button 
            onClick={() => onToggleTheme("light")}
            style={{ 
              flex: 1, 
              background: theme === "light" ? "var(--bg-card)" : "none", 
              border: "none", 
              borderRadius: "99px",
              color: theme === "light" ? "var(--text-main)" : "var(--text-muted)", 
              padding: "9px 0", 
              fontWeight: "600", 
              fontSize: "12px", 
              cursor: "pointer",
              transition: "all var(--t-normal)",
              boxShadow: theme === "light" ? "var(--shadow-sm)" : "none"
            }}
          >
            ☀️ Forest Fairy (Light)
          </button>
          <button 
            onClick={() => onToggleTheme("dark")}
            style={{ 
              flex: 1, 
              background: theme === "dark" ? "var(--bg-card)" : "none", 
              border: "none", 
              borderRadius: "99px",
              color: theme === "dark" ? "var(--text-main)" : "var(--text-muted)", 
              padding: "9px 0", 
              fontWeight: "600", 
              fontSize: "12px", 
              cursor: "pointer",
              transition: "all var(--t-normal)",
              boxShadow: theme === "dark" ? "var(--shadow-sm)" : "none"
            }}
          >
            🌙 Night Forest (Dark)
          </button>
        </div>
      </div>

      {/* App Layout Mode Selection Widget */}
      <div className="glass-card" style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "14.5px", marginBottom: "6px", color: "var(--primary)" }}>App Viewport Mode</h3>
        <p style={{ fontSize: "12px", marginBottom: "14px", lineHeight: "1.45", color: "var(--text-sub)" }}>
          Switch between the high-fidelity mobile preview shell and a full responsive web application canvas.
        </p>
        <div style={{ 
          display: "flex", 
          background: "rgba(74, 114, 94, 0.04)", 
          borderRadius: "99px", 
          padding: "4px", 
          border: "1px solid var(--border-glass)"
        }}>
          <button 
            onClick={() => onToggleLayoutMode("mobile")}
            style={{ 
              flex: 1, 
              background: layoutMode === "mobile" ? "var(--bg-card)" : "none", 
              border: "none", 
              borderRadius: "99px",
              color: layoutMode === "mobile" ? "var(--text-main)" : "var(--text-muted)", 
              padding: "9px 0", 
              fontWeight: "600", 
              fontSize: "12px", 
              cursor: "pointer",
              transition: "all var(--t-normal)",
              boxShadow: layoutMode === "mobile" ? "var(--shadow-sm)" : "none"
            }}
          >
            📱 Mobile Preview
          </button>
          <button 
            onClick={() => onToggleLayoutMode("webapp")}
            style={{ 
              flex: 1, 
              background: layoutMode === "webapp" ? "var(--bg-card)" : "none", 
              border: "none", 
              borderRadius: "99px",
              color: layoutMode === "webapp" ? "var(--text-main)" : "var(--text-muted)", 
              padding: "9px 0", 
              fontWeight: "600", 
              fontSize: "12px", 
              cursor: "pointer",
              transition: "all var(--t-normal)",
              boxShadow: layoutMode === "webapp" ? "var(--shadow-sm)" : "none"
            }}
          >
            💻 Responsive Web App
          </button>
        </div>
      </div>

      {successAlert && (
        <div 
          className="glass-card" 
          style={{ 
            background: "rgba(140, 174, 158, 0.12)", 
            borderColor: "rgba(140, 174, 158, 0.25)", 
            padding: "12px 18px", 
            marginBottom: "20px",
            color: "var(--primary)",
            fontSize: "12.5px",
            fontWeight: "600",
            textAlign: "center"
          }}
        >
          {successAlert}
        </div>
      )}

      {/* 1. GEMINI API CONFIGURATION SECTION */}
      <div className="glass-card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "15px" }}>Gemini Core Settings</h3>
          {apiKey ? (
            <span className="api-key-badge configured">
              <ShieldCheck size={12} /> CONNECTED
            </span>
          ) : (
            <span className="api-key-badge simulation">
              SIMULATION ACTIVE
            </span>
          )}
        </div>

        <p style={{ fontSize: "12px", lineHeight: "1.45", marginBottom: "16px" }}>
          Configure a client-side **Google Gemini API Key** to enable live real-time analysis of uploaded photographs. If cleared, the app operates in offline simulation mode.
        </p>

        <div className="api-key-input-container">
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input 
              type={showKey ? "text" : "password"} 
              placeholder="Paste AI Studio API Key..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              style={{ width: "100%", paddingRight: "44px" }}
            />
            <button 
              onClick={() => setShowKey(!showKey)}
              style={{ 
                position: "absolute", 
                right: "12px", 
                background: "none", 
                border: "none", 
                color: "var(--text-muted)", 
                cursor: "pointer",
                display: "flex"
              }}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px", marginBottom: "4px" }}>
            {apiKey && (
              <button 
                className="secondary-btn" 
                onClick={handleClear}
                style={{ flex: 1, padding: "12px 24px", fontSize: "13px" }}
              >
                Clear Key
              </button>
            )}
            <button 
              className="primary-btn" 
              onClick={handleSave}
              style={{ flex: 2, padding: "12px 24px", fontSize: "13px" }}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      {/* 2. INSTRUCTIONS SECTION */}
      {!apiKey && (
        <div className="glass-card" style={{ marginBottom: "20px", background: "rgba(255,255,255,0.01)" }}>
          <h4 style={{ fontSize: "13.5px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", color: "var(--primary)" }}>
            <HelpCircle size={15} />
            How to get an API Key
          </h4>
          <ol style={{ paddingLeft: "16px", fontSize: "12px", color: "var(--text-sub)", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "underline" }}>Google AI Studio</a>.</li>
            <li>Sign in with your Google account.</li>
            <li>Click on the green <strong>"Get API Key"</strong> button at the top-left.</li>
            <li>Click <strong>"Create API Key"</strong>, select a project, copy the key, and paste it in the field above!</li>
          </ol>
        </div>
      )}

      {/* SECURITY & PRIVACY CARD */}
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: "20px", 
          background: "rgba(74, 114, 94, 0.03)", 
          borderColor: "rgba(74, 114, 94, 0.15)"
        }}
      >
        <h4 style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "var(--primary)" }}>
          <ShieldCheck size={16} />
          Security & Privacy Node
        </h4>
        <ul style={{ paddingLeft: "12px", fontSize: "12px", color: "var(--text-sub)", display: "flex", flexDirection: "column", gap: "8px", listStyleType: "none" }}>
          <li style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <span style={{ color: "var(--primary)", marginTop: "2px" }}>✔</span>
            <span><strong>Zero Server Retention:</strong> Your credentials are stored strictly client-side inside sandboxed local browser storage (`localStorage`) and are never sent to external servers.</span>
          </li>
          <li style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <span style={{ color: "var(--primary)", marginTop: "2px" }}>✔</span>
            <span><strong>Direct API Transport:</strong> All photo diagnostics and chat queries travel encrypted directly to Google's official Gemini endpoint.</span>
          </li>
          <li style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <span style={{ color: "var(--primary)", marginTop: "2px" }}>✔</span>
            <span><strong>Private Conservatory Records:</strong> Your plant diagnostics, custom care journals, and botanical histories are kept fully personal, shielded from any external trackers or ad networks.</span>
          </li>
        </ul>
      </div>

      {/* 3. DATABASE HYDRATION & UTILITIES */}
      <div className="glass-card" style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "15px", marginBottom: "6px" }}>Database Utilities</h3>
        <p style={{ fontSize: "12px", marginBottom: "14px" }}>
          Seed a default medical portfolio in your virtual garden database. Perfect for exploring the care dashboard, diagnostic logs, and conversational chatbot immediately.
        </p>
        <button 
          className="secondary-btn" 
          onClick={handleHydrate}
          style={{ width: "100%", padding: "10px 16px", fontSize: "12.5px", display: "flex", gap: "8px", justifyContent: "center" }}
        >
          <RefreshCw size={14} /> Populate Conservatory Archives
        </button>
      </div>

      {/* 4. APP INFOPANEL */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", marginTop: "10px", opacity: 0.5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)" }}>
          <Info size={12} />
          <span>Petal & Parchment - Journal Node v1.2.0</span>
        </div>
        <p style={{ fontSize: "9px", color: "var(--text-muted)" }}>
          Pair-programmed by Google DeepMind Antigravity AI
        </p>
      </div>
    </div>
  );
}
