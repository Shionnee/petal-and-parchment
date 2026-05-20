import React, { useState } from "react";
import { ArrowLeft, Heart, HeartOff, MessageSquare, Sun, Droplets, Wind, Thermometer, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";

export default function PlantDossier({ plantData, onBack, onSaveToggle, isSaved, onConsultAgent }) {
  const {
    id,
    plantName,
    botanicalName,
    family,
    difficulty,
    origin,
    description,
    light,
    water,
    humidity,
    temperature,
    toxicity,
    conditionName,
    severity,
    healthScore,
    diagnosisDescription,
    symptoms = [],
    causes = [],
    treatment = [],
    image
  } = plantData;

  const [activeTab, setActiveTab] = useState("diagnosis"); // diagnosis or care

  // Health gauge color calculations
  const getGaugeColor = () => {
    if (healthScore >= 90) return "var(--primary)";
    if (healthScore >= 60) return "var(--secondary)";
    return "var(--crimson)";
  };

  // Helper to extract nice percentage from text
  const parsePercent = (val, defaultVal = 70) => {
    if (!val) return defaultVal;
    const matches = val.match(/(\d+)%/);
    if (matches && matches[1]) {
      return parseInt(matches[1], 10);
    }
    const digitMatches = val.match(/(\d+)/);
    if (digitMatches && digitMatches[1]) {
      const num = parseInt(digitMatches[1], 10);
      if (num > 0 && num <= 100) return num;
      if (num > 100) return 80;
    }
    const lower = val.toLowerCase();
    if (lower.includes("high") || lower.includes("bright") || lower.includes("wet")) return 85;
    if (lower.includes("moderate") || lower.includes("medium") || lower.includes("constant")) return 65;
    if (lower.includes("low") || lower.includes("shade") || lower.includes("dry")) return 40;
    return defaultVal;
  };

  const lightPct = parsePercent(light, 75);
  const waterPct = parsePercent(water, 60);
  const humidityPct = parsePercent(humidity, 55);

  return (
    <div className="screen-container" style={{ padding: "0 0 100px 0" }}>
      {/* 1. HERO BANNER PANEL WITH WAVE CURVE AND ISOLATED PLANT */}
      <div 
        className="dossier-image-hero" 
        style={{
          background: "radial-gradient(circle at 50% 110%, rgba(var(--primary-rgb), 0.18) 0%, rgba(var(--secondary-rgb), 0.08) 60%, var(--bg-phone) 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "280px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--border-glass)"
        }}
      >
        {/* Isolated emerging plant image with high-end dropshadow */}
        <div 
          className="organic-plant-container"
          style={{
            height: "90%",
            width: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            position: "relative",
            marginTop: "10px"
          }}
        >
          <img 
            src={image || "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80"} 
            alt={plantName}
            style={{
              maxHeight: "190px",
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 16px 28px rgba(40, 60, 48, 0.25))",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80";
            }}
          />
        </div>

        {/* ABSOLUTE FLOATING GLASS CAPSULES */}
        {/* Light Absorption Floater */}
        <div 
          className="metric-floater float-1"
          style={{ left: "14px", top: "72px" }}
        >
          <div 
            className="floater-ring" 
            style={{ 
              background: `radial-gradient(closest-side, var(--bg-card) 76%, transparent 0%), conic-gradient(var(--secondary) ${lightPct}%, rgba(var(--secondary-rgb), 0.15) 0)` 
            }}
          >
            <Sun size={11} style={{ color: "var(--secondary)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
            <span style={{ fontSize: "8px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Light</span>
            <span style={{ fontSize: "11px", color: "var(--text-main)", fontWeight: "700", marginTop: "1px" }}>{lightPct}%</span>
          </div>
        </div>

        {/* Moisture Level Floater */}
        <div 
          className="metric-floater float-2"
          style={{ right: "14px", top: "54px" }}
        >
          <div 
            className="floater-ring" 
            style={{ 
              background: `radial-gradient(closest-side, var(--bg-card) 76%, transparent 0%), conic-gradient(var(--primary) ${waterPct}%, rgba(var(--primary-rgb), 0.15) 0)` 
            }}
          >
            <Droplets size={11} style={{ color: "var(--primary)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
            <span style={{ fontSize: "8px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Water</span>
            <span style={{ fontSize: "11px", color: "var(--text-main)", fontWeight: "700", marginTop: "1px" }}>{waterPct}%</span>
          </div>
        </div>

        {/* Humidity Floater */}
        <div 
          className="metric-floater float-3"
          style={{ right: "20px", bottom: "46px" }}
        >
          <div 
            className="floater-ring" 
            style={{ 
              background: `radial-gradient(closest-side, var(--bg-card) 76%, transparent 0%), conic-gradient(var(--info) ${humidityPct}%, rgba(131, 171, 194, 0.15) 0)` 
            }}
          >
            <Wind size={11} style={{ color: "var(--info)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
            <span style={{ fontSize: "8px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Humidity</span>
            <span style={{ fontSize: "11px", color: "var(--text-main)", fontWeight: "700", marginTop: "1px" }}>{humidityPct}%</span>
          </div>
        </div>

        {/* Dynamic Curved White Mask Backdrop at the bottom */}
        <div style={{
          position: "absolute",
          bottom: "-1px",
          left: 0,
          right: 0,
          height: "28px",
          background: "var(--bg-phone)",
          borderRadius: "28px 28px 0 0",
          zIndex: 3,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.01)"
        }} />
        
        {/* Sizable blurred navigation controllers */}
        <button 
          onClick={onBack} 
          className="camera-utility-btn" 
          style={{ 
            position: "absolute", 
            top: "20px", 
            left: "20px", 
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            color: "var(--text-main)",
            zIndex: 10,
            boxShadow: "var(--shadow-sm)"
          }}
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>

        <button 
          onClick={() => onSaveToggle(plantData)} 
          className="camera-utility-btn" 
          style={{ 
            position: "absolute", 
            top: "20px", 
            right: "20px", 
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            color: isSaved ? "var(--crimson)" : "var(--text-main)",
            zIndex: 10,
            boxShadow: "var(--shadow-sm)",
            transition: "transform var(--t-fast)"
          }}
          aria-label={isSaved ? "Remove from Garden" : "Save to Garden"}
        >
          {isSaved ? <HeartOff size={16} fill="var(--crimson)" style={{ color: "var(--crimson)" }} /> : <Heart size={16} />}
        </button>
      </div>

      {/* 2. CORE PLANT HEADER & SPECIES METADATA */}
      <div style={{ padding: "0 24px" }}>
        <p style={{ 
          fontSize: "10.5px", 
          color: "var(--primary)", 
          textTransform: "uppercase", 
          letterSpacing: "1.8px", 
          fontWeight: "600", 
          fontFamily: "var(--font-body)",
          marginBottom: "4px"
        }}>
          Botanical Dossier
        </p>
        <h1 style={{ fontSize: "28px", lineHeight: "1.15", marginBottom: "4px", textAlign: "left" }}>
          {plantName}
        </h1>
        <p style={{ fontStyle: "italic", fontSize: "13px", color: "var(--text-sub)", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span>{botanicalName}</span> 
          <span style={{ color: "var(--text-muted)" }}>•</span> 
          <span>Family: {family}</span>
        </p>

        {/* Small badge overview */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", marginBottom: "20px" }}>
          <span style={{ 
            background: "var(--bg-card)", 
            border: "1px solid var(--border-glass)", 
            borderRadius: "99px", 
            padding: "4px 10px", 
            fontSize: "10px", 
            color: "var(--text-sub)", 
            fontWeight: "500",
            boxShadow: "var(--shadow-sm)"
          }}>
            Diff: {difficulty}
          </span>
          {origin && (
            <span style={{ 
              background: "var(--bg-card)", 
              border: "1px solid var(--border-glass)", 
              borderRadius: "99px", 
              padding: "4px 10px", 
              fontSize: "10px", 
              color: "var(--text-sub)", 
              fontWeight: "500",
              boxShadow: "var(--shadow-sm)"
            }}>
              {origin.split(",")[0]}
            </span>
          )}
          {toxicity && (
            <span style={{ 
              background: "rgba(214, 123, 123, 0.08)", 
              border: "1px solid rgba(214, 123, 123, 0.15)", 
              borderRadius: "99px", 
              padding: "4px 10px", 
              fontSize: "10px", 
              color: "var(--crimson)", 
              fontWeight: "600",
              display: "flex", 
              alignItems: "center", 
              gap: "4px" 
            }}>
              <ShieldAlert size={10} /> Toxic
            </span>
          )}
        </div>

        {/* Premium segmented tabs switch */}
        <div style={{ 
          display: "flex", 
          background: "rgba(74, 114, 94, 0.04)", 
          borderRadius: "14px", 
          padding: "4px", 
          marginBottom: "24px",
          border: "1px solid var(--border-glass)"
        }}>
          <button 
            onClick={() => setActiveTab("diagnosis")}
            style={{ 
              flex: 1, 
              background: activeTab === "diagnosis" ? "var(--bg-card)" : "none", 
              border: "none", 
              borderRadius: "10px",
              color: activeTab === "diagnosis" ? "var(--text-main)" : "var(--text-muted)", 
              padding: "9px 0", 
              fontWeight: "600", 
              fontSize: "12.5px", 
              cursor: "pointer",
              transition: "all var(--t-normal)",
              boxShadow: activeTab === "diagnosis" ? "var(--shadow-sm)" : "none"
            }}
          >
            Health Diagnosis
          </button>
          <button 
            onClick={() => setActiveTab("care")}
            style={{ 
              flex: 1, 
              background: activeTab === "care" ? "var(--bg-card)" : "none", 
              border: "none", 
              borderRadius: "10px",
              color: activeTab === "care" ? "var(--text-main)" : "var(--text-muted)", 
              padding: "9px 0", 
              fontWeight: "600", 
              fontSize: "12.5px", 
              cursor: "pointer",
              transition: "all var(--t-normal)",
              boxShadow: activeTab === "care" ? "var(--shadow-sm)" : "none"
            }}
          >
            Care Guide
          </button>
        </div>

        {/* 3. DIAGNOSIS TAB VIEW */}
        {activeTab === "diagnosis" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Health Score Circular Dial Card */}
            <div className="glass-card dossier-health-gauge-container" style={{ padding: "18px" }}>
              <div 
                className="health-circular-progress" 
                style={{ 
                  "--gauge-color": getGaugeColor(), 
                  "--gauge-percent": `${healthScore}%`,
                  color: getGaugeColor(),
                  flexShrink: 0
                }}
              >
                {healthScore}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span className={`status-pill ${severity}`} style={{ marginBottom: "6px" }}>
                  {severity}
                </span>
                <h3 style={{ fontSize: "16px", lineHeight: "1.25", marginBottom: "4px" }}>{conditionName}</h3>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>AI Diagnostic Certainty: 95%</p>
              </div>
            </div>

            {/* Pathologist Assessment Card */}
            <div className="glass-card" style={{ padding: "20px" }}>
              <h4 style={{ fontSize: "14.5px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "var(--primary)" }}>
                <AlertTriangle size={16} style={{ color: getGaugeColor() }} />
                Pathologist Assessment
              </h4>
              <p style={{ fontSize: "13px", lineHeight: "1.55", color: "var(--text-main)" }}>{diagnosisDescription}</p>

              {/* Symptoms List */}
              {symptoms.length > 0 && (
                <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-glass)", paddingTop: "14px" }}>
                  <h5 style={{ fontSize: "12px", color: "var(--text-main)", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--gold)" }}></span>
                    Observed Symptoms
                  </h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {symptoms.map((s, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          fontSize: "11px", 
                          color: "var(--text-sub)", 
                          background: "rgba(74, 114, 94, 0.03)", 
                          padding: "4px 10px", 
                          borderRadius: "99px",
                          border: "1px solid var(--border-glass)" 
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Causes List */}
              {causes.length > 0 && (
                <div style={{ marginTop: "14px", borderTop: "1px solid var(--border-glass)", paddingTop: "14px" }}>
                  <h5 style={{ fontSize: "12px", color: "var(--text-main)", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)" }}></span>
                    Potential Causes
                  </h5>
                  <ul style={{ paddingLeft: "12px", display: "flex", flexDirection: "column", gap: "6px", listStyleType: "none" }}>
                    {causes.map((c, idx) => (
                      <li key={idx} style={{ fontSize: "12px", color: "var(--text-sub)", display: "flex", gap: "8px" }}>
                        <span style={{ color: "var(--secondary)" }}>•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recovery Treatment Plan Timeline */}
            <div>
              <h3 style={{ fontSize: "16px", marginBottom: "14px", fontFamily: "var(--font-header)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={16} style={{ color: "var(--secondary)" }} />
                Prescribed Treatment Plan
              </h3>
              <div className="treatment-list">
                {treatment.map((step, idx) => (
                  <div key={idx} className="treatment-step" style={{ marginBottom: "6px" }}>
                    <div className="treatment-step-node" style={{ background: "var(--bg-card)" }}>{idx + 1}</div>
                    <div className="treatment-step-content" style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)" }}>
                      <p style={{ fontSize: "12.5px", color: "var(--text-main)", lineHeight: "1.5" }}>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consult Chatbot FAB Link */}
            <button 
              className="primary-btn" 
              onClick={() => onConsultAgent(plantData)}
              style={{ 
                marginTop: "10px", 
                background: "linear-gradient(135deg, var(--bg-nav) 0%, var(--primary-hover) 100%)",
                boxShadow: "0 8px 24px rgba(20, 32, 26, 0.15)",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <MessageSquare size={16} />
              Consult Dr. Sage on recovery
            </button>
          </div>
        )}

        {/* 4. CARE DETAILS TAB VIEW */}
        {activeTab === "care" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="glass-card" style={{ padding: "20px" }}>
              <h4 style={{ fontSize: "14.5px", marginBottom: "8px", color: "var(--primary)" }}>Species Bio</h4>
              <p style={{ fontSize: "13px", lineHeight: "1.55" }}>{description}</p>
              {origin && (
                <p style={{ fontSize: "11px", marginTop: "12px", color: "var(--text-muted)", fontStyle: "italic", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>Native Range:</span> <span>{origin}</span>
                </p>
              )}
            </div>

            {/* Specs Grid */}
            <h3 style={{ fontSize: "16px", marginBottom: "-8px", fontFamily: "var(--font-header)" }}>Care Matrix</h3>
            <div className="care-grid">
              <div className="care-metric-box" style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)" }}>
                <Sun size={18} style={{ color: "var(--secondary)" }} />
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.5px" }}>LIGHTING</span>
                <span style={{ fontSize: "11.5px", color: "var(--text-main)", fontWeight: "600", lineHeight: "1.35" }}>
                  {light.length > 42 ? light.substring(0, 42) + "..." : light}
                </span>
              </div>

              <div className="care-metric-box" style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)" }}>
                <Droplets size={18} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.5px" }}>WATER</span>
                <span style={{ fontSize: "11.5px", color: "var(--text-main)", fontWeight: "600", lineHeight: "1.35" }}>
                  {water.length > 42 ? water.substring(0, 42) + "..." : water}
                </span>
              </div>

              <div className="care-metric-box" style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)" }}>
                <Wind size={18} style={{ color: "var(--info)" }} />
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.5px" }}>HUMIDITY</span>
                <span style={{ fontSize: "11.5px", color: "var(--text-main)", fontWeight: "600", lineHeight: "1.35" }}>
                  {humidity}
                </span>
              </div>

              <div className="care-metric-box" style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)" }}>
                <Thermometer size={18} style={{ color: "var(--gold)" }} />
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.5px" }}>TEMPERATURE</span>
                <span style={{ fontSize: "11.5px", color: "var(--text-main)", fontWeight: "600", lineHeight: "1.35" }}>
                  {temperature}
                </span>
              </div>
            </div>

            {/* Toxicity Warning block */}
            {toxicity && (
              <div 
                className="glass-card" 
                style={{ 
                  background: "rgba(214, 123, 123, 0.04)", 
                  border: "1px solid rgba(214, 123, 123, 0.15)",
                  padding: "16px" 
                }}
              >
                <h4 style={{ fontSize: "14px", color: "var(--crimson)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <ShieldAlert size={16} />
                  Hazard / Toxicity Alert
                </h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-sub)", lineHeight: "1.5" }}>{toxicity}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

