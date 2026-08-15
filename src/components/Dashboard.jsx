import React, { useState } from "react";
import { Plus, Droplets, Sparkles, ChevronRight, Award, Compass, Heart } from "lucide-react";

export default function Dashboard({ savedPlants, onSelectPlant, onNavigateToScan, theme, onToggleTheme, apiKey, onNavigateToSettings }) {
  // Simple check-off task lists for daily engagement
  const [tasks, setTasks] = useState([
    { id: 1, text: "Water Monstera Deliciosa", done: false, type: "water" },
    { id: 2, text: "Wipe Fiddle Leaf Fig leaves", done: false, type: "clean" },
    { id: 3, text: "Mist Peace Lily foliage", done: false, type: "mist" }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Plant health status style helper
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "critical": return "critical";
      case "warning": return "warning";
      default: return "healthy";
    }
  };

  // Calculate average garden health index
  const averageHealth = savedPlants.length > 0
    ? Math.round(savedPlants.reduce((sum, p) => sum + (p.healthScore || 100), 0) / savedPlants.length)
    : 0;

  const getGardenStatusText = (avg) => {
    if (avg >= 85) return "Flourishing Sanctuary 🌸";
    if (avg >= 60) return "Nurturing Sanctuary 🌱";
    return "Stressed Canopy ⚠️";
  };

  return (
    <div className="screen-container">
      {/* Dashboard Custom Profile Header */}
      <div className="dashboard-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", paddingBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Brand Logo Emblem */}
          <div style={{
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            border: "1.5px solid var(--primary)",
            padding: "2px",
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-sm)",
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <img 
              src="/logo.png" 
              alt="Petal & Parchment Emblem" 
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
            />
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "700", fontFamily: "var(--font-body)", margin: 0 }}>petal & parchment</p>
            <h2 style={{ fontSize: "24px", marginTop: "2px", fontFamily: "var(--font-header)", fontWeight: "400", margin: 0, lineHeight: "1.2", color: "var(--text-main)" }}>
              your cozy <span className="italic-serif">conservatory</span> ✨
            </h2>
          </div>
        </div>
        <button 
          onClick={onToggleTheme} 
          className="theme-toggle-btn-header"
          aria-label="Toggle Theme"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-glass)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            fontSize: "20px",
            transition: "all var(--t-fast)",
            outline: "none",
            flexShrink: 0
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Hero Tip Card */}
      <div className="glass-card tip-card" style={{ marginBottom: "26px", padding: "18px 20px", background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(244, 227, 193, 0.08) 100%)" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ 
            background: "rgba(244, 227, 193, 0.25)", 
            borderRadius: "50%", 
            width: "42px", 
            height: "42px", 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            color: "#836934", 
            border: "1px solid rgba(244, 227, 193, 0.45)",
            flexShrink: 0
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)", marginBottom: "3px" }}>Botanist's Tip of the Day</h4>
            <p style={{ fontSize: "15px", lineHeight: "1.45", color: "var(--text-sub)" }}>
              "Always check soil moisture 2 inches deep before watering. Plants adapt to root drought far better than root drowning!"
            </p>
          </div>
        </div>
      </div>

      {/* 🌟 Dynamic Sanctuary Health Index Overview Widget */}
      {savedPlants.length > 0 && (
        <div 
          className="glass-card animate-pop" 
          style={{ 
            marginBottom: "26px", 
            padding: "20px",
            background: "linear-gradient(135deg, var(--bg-card), rgba(249, 195, 195, 0.04))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid var(--border-glass)",
            boxShadow: "var(--shadow-md)"
          }}
        >
          <div style={{ flex: 1, paddingRight: "14px" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700", marginBottom: "4px" }}>Sanctuary Vitality</p>
            <h3 style={{ fontSize: "22px", fontFamily: "var(--font-header)", color: "var(--text-main)", marginBottom: "4px" }}>
              {getGardenStatusText(averageHealth)}
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: "1.4" }}>
              Average health rating is <strong style={{ color: "var(--primary)" }}>{averageHealth}%</strong>. Keep up the great care!
            </p>
            
            {/* Quick Micro-Badge Indicators */}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "99px", background: "rgba(197, 180, 165, 0.1)", color: "var(--text-main)", border: "1px solid rgba(197, 180, 165, 0.15)" }}>
                🌿 {savedPlants.length} Plants
              </span>
              <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "99px", background: "rgba(249, 195, 195, 0.12)", color: "#8a3f3f", border: "1px solid rgba(249, 195, 195, 0.2)" }}>
                ✨ Sprout Guardian
              </span>
            </div>
          </div>
          
          {/* Symmetrical Circular Conic Progress Ring */}
          <div 
            className="garden-vitality-dial"
            style={{ 
              position: "relative", 
              width: "70px", 
              height: "70px", 
              borderRadius: "50%", 
              background: `conic-gradient(var(--secondary) ${averageHealth * 3.6}deg, var(--border-glass) 0deg)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0
            }}
          >
            {/* Inner masking cutout card overlay */}
            <div 
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--bg-card)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.5px" }}>{averageHealth}%</span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Index</span>
            </div>
          </div>
        </div>
      )}

      {/* "My Garden" Section */}
      <div style={{ marginBottom: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "700" }}>My Garden ({savedPlants.length})</h3>
          {savedPlants.length > 0 && (
            <button 
              onClick={onNavigateToScan}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "15px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
            >
              Add Plant <Plus size={14} />
            </button>
          )}
        </div>

        {savedPlants.length === 0 ? (
          /* Sprout Guardian Onboarding Stepper Guide */
          <div 
            className="glass-card animate-pop" 
            style={{ 
              padding: "28px 20px", 
              border: "1px solid var(--border-glass)",
              background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(244, 227, 193, 0.08) 100%)",
              boxShadow: "var(--shadow-md)",
              position: "relative"
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <div style={{ 
                width: "56px", 
                height: "56px", 
                borderRadius: "50%", 
                background: "rgba(244, 227, 193, 0.25)", 
                display: "inline-flex", 
                justifyContent: "center", 
                alignItems: "center", 
                color: "var(--primary)", 
                border: "1px solid rgba(244, 227, 193, 0.45)",
                marginBottom: "12px"
              }}>
                <Compass size={24} style={{ color: "var(--text-sub)" }} />
              </div>
              <h4 className="italic-serif" style={{ fontSize: "22px", fontWeight: "400", marginBottom: "6px", color: "var(--text-main)" }}>
                begin your nurture ritual ✨
              </h4>
              <p style={{ fontSize: "15px", color: "var(--text-sub)", maxWidth: "290px", margin: "0 auto", lineHeight: "1.5", fontFamily: "var(--font-body)" }}>
                Complete these initial steps to activate your digital greenhouse journal and begin cultivating your sanctuary.
              </p>
            </div>

            {/* Steps Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              
              {/* Step 1: Configure API Key */}
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                alignItems: "flex-start",
                padding: "14px",
                background: "var(--bg-app)",
                border: "1px solid var(--border-glass)",
                borderRadius: "18px",
                boxShadow: "var(--shadow-sm)"
              }}>
                <div style={{ 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%", 
                  background: apiKey ? "var(--green)" : "rgba(249, 195, 195, 0.15)", 
                  border: `1.5px solid ${apiKey ? "rgba(var(--primary-rgb), 0.25)" : "var(--secondary)"}`,
                  color: apiKey ? "var(--text-main)" : "var(--text-sub)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  flexShrink: 0,
                  marginTop: "2px"
                }}>
                  {apiKey ? "✓" : "1"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h5 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)" }}>
                      Configure Gemini AI Core
                    </h5>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "99px", background: apiKey ? "var(--green)" : "rgba(244, 227, 193, 0.4)", color: "var(--text-main)", letterSpacing: "0.2px" }}>
                      {apiKey ? "CONNECTED" : "RECOMMENDED"}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-sub)", marginTop: "4px", lineHeight: "1.45" }}>
                    Input your secure Gemini API key in settings to enable live, high-fidelity disease diagnosis on custom image uploads.
                  </p>
                  {!apiKey && onNavigateToSettings && (
                    <button 
                      onClick={onNavigateToSettings}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "var(--text-sub)", 
                        fontSize: "13px", 
                        fontWeight: "700", 
                        cursor: "pointer", 
                        padding: "0", 
                        marginTop: "6px",
                        textDecoration: "underline"
                      }}
                    >
                      Connect API Key →
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2: Hydrate or Scan */}
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                alignItems: "flex-start",
                padding: "14px",
                background: "var(--bg-app)",
                border: "1px solid var(--border-glass)",
                borderRadius: "18px",
                boxShadow: "var(--shadow-sm)"
              }}>
                <div style={{ 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%", 
                  background: "rgba(244, 227, 193, 0.2)", 
                  border: "1.5px solid var(--gold)",
                  color: "var(--text-sub)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  flexShrink: 0,
                  marginTop: "2px"
                }}>
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)" }}>
                    Add Your First Plant
                  </h5>
                  <p style={{ fontSize: "13px", color: "var(--text-sub)", marginTop: "4px", lineHeight: "1.45" }}>
                    Open the camera to scan a foliage specimen, or seed your digital conservatory instantly using our pre-baked developer plants.
                  </p>
                  {onNavigateToSettings && (
                    <button 
                      onClick={onNavigateToSettings}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "var(--text-sub)", 
                        fontSize: "13px", 
                        fontWeight: "700", 
                        cursor: "pointer", 
                        padding: "0", 
                        marginTop: "6px",
                        textDecoration: "underline"
                      }}
                    >
                      Hydrate Demo Plants →
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Shutter action CTA */}
            <button className="primary-btn" onClick={onNavigateToScan} style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "center", gap: "8px", borderRadius: "99px" }}>
              <Plus size={18} />
              Open AI Shutter Scanner
            </button>
          </div>
        ) : (
          // Horizontal carousel of plants styled in ultra-premium cards
          <div className="garden-carousel">
            {savedPlants.map((plant) => (
              <div 
                key={plant.id} 
                className={`glass-card plant-card-carousel organic-plant-container ${getSeverityStyle(plant.severity)}`}
                onClick={() => onSelectPlant(plant)}
                style={{
                  minWidth: "156px",
                  width: "156px",
                  padding: "16px 14px 18px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer"
                }}
              >
                {/* Floating percentage badge */}
                <div style={{ 
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: theme === "dark" ? "rgba(0, 0, 0, 0.45)" : "var(--bg-app)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "99px",
                  padding: "2px 8px",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: plant.healthScore > 85 
                    ? (theme === "dark" ? "var(--primary)" : "#385e49") 
                    : plant.healthScore > 60 
                      ? (theme === "dark" ? "var(--gold)" : "#836934") 
                      : (theme === "dark" ? "var(--crimson)" : "#9c3f3f"),
                  zIndex: 2,
                  boxShadow: "var(--shadow-sm)"
                }}>
                  {plant.healthScore}%
                </div>

                {/* Plant cut-out arched photo with status badge */}
                <div style={{ position: "relative", marginBottom: "14px", width: "74px", height: "100px" }}>
                  <div className="editorial-arch" style={{ width: "100%", height: "100%" }}>
                    <img 
                      src={plant.image || "https://images.unsplash.com/photo-1545241047-6083a3684587?w=150&auto=format&fit=crop&q=60"} 
                      alt={plant.plantName} 
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1545241047-6083a3684587?w=150&auto=format&fit=crop&q=60";
                      }}
                    />
                  </div>
                  {/* Status pulsing dot */}
                  <div style={{
                    position: "absolute",
                    bottom: "-3px",
                    right: "-3px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: plant.severity === "healthy" ? "var(--primary)" : plant.severity === "warning" ? "var(--gold)" : "var(--crimson)",
                    border: "2px solid var(--bg-card)",
                    boxShadow: "var(--shadow-sm)"
                  }}></div>
                </div>

                {/* Symmetrical typography and serif titles */}
                <div style={{ marginBottom: "10px" }}>
                  <h4 style={{ 
                    fontFamily: "var(--font-header)", 
                    fontSize: "18px", 
                    fontWeight: "700", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap", 
                    width: "128px", 
                    color: "var(--text-main)" 
                  }}>
                    {plant.plantName}
                  </h4>
                  <p style={{ 
                    fontSize: "12px", 
                    fontStyle: "italic", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap", 
                    width: "128px", 
                    color: "var(--text-muted)",
                    marginTop: "1px"
                  }}>
                    {plant.botanicalName}
                  </p>
                </div>

                {/* Symmetrical soft capsule status tag */}
                <div className={`status-pill ${getSeverityStyle(plant.severity)}`} style={{ padding: "4px 10px", fontSize: "11px", fontWeight: "700" }}>
                  {plant.severity === "healthy" ? "PERFECTLY" : plant.severity === "warning" ? "ATTENTION" : "CRITICAL"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily care tasks panel */}
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>Daily Care Schedule</h3>
        <div className="todo-list">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`todo-item ${task.done ? "done" : ""}`} 
              onClick={() => toggleTask(task.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-glass)",
                borderRadius: "20px",
                transition: "all var(--t-fast)",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className={`todo-checkbox ${task.done ? "checked" : ""}`}>
                  {task.done && <span style={{ fontSize: "12px", fontWeight: "900" }}>✓</span>}
                </div>
                <span style={{ 
                  fontSize: "16px", 
                  fontWeight: "500",
                  textDecoration: task.done ? "line-through" : "none", 
                  color: task.done ? "var(--text-muted)" : "var(--text-main)" 
                }}>
                  {task.text}
                </span>
              </div>
              <Droplets size={16} style={{ color: task.done ? "var(--text-muted)" : "var(--primary)", transition: "color var(--t-fast)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
