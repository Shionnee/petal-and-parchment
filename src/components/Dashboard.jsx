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
      <div className="dashboard-header">
        <div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "600" }}>Welcome Back</p>
          <h2 style={{ fontSize: "22px", marginTop: "2px" }}>Plant Parent 🌱</h2>
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
            fontSize: "18px",
            transition: "all var(--t-fast)",
            outline: "none"
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Hero Tip Card */}
      <div className="glass-card tip-card" style={{ marginBottom: "26px", padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ 
            background: "rgba(213, 176, 103, 0.12)", 
            borderRadius: "50%", 
            width: "42px", 
            height: "42px", 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            color: "var(--secondary)", 
            border: "1px solid rgba(213, 176, 103, 0.18)",
            flexShrink: 0
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)", marginBottom: "3px" }}>Botanist's Tip of the Day</h4>
            <p style={{ fontSize: "12.5px", lineHeight: "1.45", color: "var(--text-sub)" }}>
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
            background: "linear-gradient(135deg, var(--bg-card), rgba(74, 114, 94, 0.03))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid var(--border-glass)",
            boxShadow: "var(--shadow-md)"
          }}
        >
          <div style={{ flex: 1, paddingRight: "14px" }}>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", marginBottom: "4px" }}>Sanctuary Vitality</p>
            <h3 style={{ fontSize: "18px", fontFamily: "var(--font-header)", color: "var(--text-main)", marginBottom: "4px" }}>
              {getGardenStatusText(averageHealth)}
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-sub)", lineHeight: "1.4" }}>
              Average health rating is <strong style={{ color: "var(--primary)" }}>{averageHealth}%</strong>. Keep up the great care!
            </p>
            
            {/* Quick Micro-Badge Indicators */}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", fontWeight: "700", padding: "3px 8px", borderRadius: "99px", background: "var(--primary-glow)", color: "var(--primary)", border: "1px solid rgba(74, 114, 94, 0.08)" }}>
                🌿 {savedPlants.length} Plants
              </span>
              <span style={{ fontSize: "9px", fontWeight: "700", padding: "3px 8px", borderRadius: "99px", background: "rgba(213, 176, 103, 0.08)", color: "var(--secondary)", border: "1px solid rgba(213, 176, 103, 0.12)" }}>
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
              background: `conic-gradient(var(--primary) ${averageHealth * 3.6}deg, rgba(74,114,94,0.08) 0deg)`,
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
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.5px" }}>{averageHealth}%</span>
              <span style={{ fontSize: "8px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Index</span>
            </div>
          </div>
        </div>
      )}

      {/* "My Garden" Section */}
      <div style={{ marginBottom: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>My Garden ({savedPlants.length})</h3>
          {savedPlants.length > 0 && (
            <button 
              onClick={onNavigateToScan}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12.5px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
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
              background: "linear-gradient(135deg, var(--bg-card), rgba(74, 114, 94, 0.02))",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <div style={{ 
                width: "56px", 
                height: "56px", 
                borderRadius: "50%", 
                background: "var(--primary-glow)", 
                display: "inline-flex", 
                justifyContent: "center", 
                alignItems: "center", 
                color: "var(--primary)", 
                border: "1px solid var(--border-glass)",
                marginBottom: "12px"
              }}>
                <Compass size={24} />
              </div>
              <h4 style={{ fontSize: "17px", fontWeight: "700", fontFamily: "var(--font-header)", marginBottom: "4px" }}>
                Welcome to your Forest Sanctuary! ✨
              </h4>
              <p style={{ fontSize: "12.5px", color: "var(--text-sub)", maxWidth: "290px", margin: "0 auto", lineHeight: "1.45" }}>
                Complete these interactive steps to activate your digital greenhouse node and begin nurturing your garden.
              </p>
            </div>

            {/* Steps Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              
              {/* Step 1: Configure API Key */}
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                alignItems: "flex-start",
                padding: "12px 14px",
                background: "rgba(255, 255, 255, 0.45)",
                border: "1px solid var(--border-glass)",
                borderRadius: "16px"
              }}>
                <div style={{ 
                  width: "22px", 
                  height: "22px", 
                  borderRadius: "50%", 
                  background: apiKey ? "var(--primary-glow)" : "rgba(181, 149, 86, 0.08)", 
                  border: `1.5px solid ${apiKey ? "var(--primary)" : "var(--secondary)"}`,
                  color: apiKey ? "var(--primary)" : "var(--secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10.5px",
                  fontWeight: "700",
                  flexShrink: 0,
                  marginTop: "2px"
                }}>
                  {apiKey ? "✓" : "1"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h5 style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--text-main)" }}>
                      Configure Gemini AI Core
                    </h5>
                    <span style={{ fontSize: "9px", fontWeight: "700", padding: "2px 6px", borderRadius: "99px", background: apiKey ? "rgba(74, 114, 94, 0.08)" : "rgba(213, 176, 103, 0.08)", color: apiKey ? "var(--primary)" : "var(--secondary)" }}>
                      {apiKey ? "CONFIGURED" : "RECOMMENDED"}
                    </span>
                  </div>
                  <p style={{ fontSize: "11.5px", color: "var(--text-sub)", marginTop: "3px", lineHeight: "1.4" }}>
                    Set up your secure client-side Gemini key in settings to enable live botanical pathology diagnostics from custom photos.
                  </p>
                  {!apiKey && onNavigateToSettings && (
                    <button 
                      onClick={onNavigateToSettings}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "var(--primary)", 
                        fontSize: "11px", 
                        fontWeight: "700", 
                        cursor: "pointer", 
                        padding: "0", 
                        marginTop: "6px",
                        textDecoration: "underline"
                      }}
                    >
                      Configure API Key →
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2: Hydrate or Scan */}
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                alignItems: "flex-start",
                padding: "12px 14px",
                background: "rgba(255, 255, 255, 0.45)",
                border: "1px solid var(--border-glass)",
                borderRadius: "16px"
              }}>
                <div style={{ 
                  width: "22px", 
                  height: "22px", 
                  borderRadius: "50%", 
                  background: "rgba(181, 149, 86, 0.08)", 
                  border: "1.5px solid var(--secondary)",
                  color: "var(--secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10.5px",
                  fontWeight: "700",
                  flexShrink: 0,
                  marginTop: "2px"
                }}>
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--text-main)" }}>
                    Add Your First Plant
                  </h5>
                  <p style={{ fontSize: "11.5px", color: "var(--text-sub)", marginTop: "3px", lineHeight: "1.4" }}>
                    Capture or upload a leaf photo to trigger our smart diagnosis engine, or seed your database instantly using our developer demo suite in settings.
                  </p>
                  {onNavigateToSettings && (
                    <button 
                      onClick={onNavigateToSettings}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "var(--primary)", 
                        fontSize: "11px", 
                        fontWeight: "700", 
                        cursor: "pointer", 
                        padding: "0", 
                        marginTop: "6px",
                        textDecoration: "underline",
                        marginRight: "14px"
                      }}
                    >
                      Hydrate Demo Plants →
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Shutter action CTA */}
            <button className="primary-btn" onClick={onNavigateToScan} style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "center", gap: "8px" }}>
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
                  background: "rgba(250, 253, 251, 0.9)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "8px",
                  padding: "2px 5px",
                  fontSize: "9px",
                  fontWeight: "700",
                  color: plant.healthScore > 85 ? "var(--primary)" : plant.healthScore > 60 ? "var(--gold)" : "var(--crimson)",
                  zIndex: 2
                }}>
                  {plant.healthScore}%
                </div>

                {/* Plant cut-out circular photo with status-ring boundary */}
                <div style={{ position: "relative", marginBottom: "12px" }}>
                  <div 
                    className="status-ring-pulsing" 
                    style={{ 
                      padding: "3px", 
                      border: "2px solid var(--border-glass)",
                      borderRadius: "50%",
                      "--pulse-color": plant.severity === "healthy" ? "rgba(74, 114, 94, 0.15)" : plant.severity === "warning" ? "rgba(213, 176, 103, 0.2)" : "rgba(214, 123, 123, 0.2)"
                    }}
                  >
                    <img 
                      src={plant.image || "https://images.unsplash.com/photo-1545241047-6083a3684587?w=150&auto=format&fit=crop&q=60"} 
                      alt={plant.plantName} 
                      style={{
                        width: "68px",
                        height: "68px",
                        objectFit: "cover",
                        borderRadius: "50%",
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
                    bottom: "3px",
                    right: "3px",
                    width: "11px",
                    height: "11px",
                    borderRadius: "50%",
                    background: plant.severity === "healthy" ? "var(--primary)" : plant.severity === "warning" ? "var(--gold)" : "var(--crimson)",
                    border: "2px solid var(--bg-phone)"
                  }}></div>
                </div>

                {/* Symmetrical typography and serif titles */}
                <div style={{ marginBottom: "10px" }}>
                  <h4 style={{ 
                    fontFamily: "var(--font-header)", 
                    fontSize: "14px", 
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
                    fontSize: "10.5px", 
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
                <div className={`status-pill ${getSeverityStyle(plant.severity)}`} style={{ padding: "4px 10px", fontSize: "8.5px", fontWeight: "700" }}>
                  {plant.severity === "healthy" ? "PERFECTLY" : plant.severity === "warning" ? "ATTENTION" : "CRITICAL"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily care tasks panel */}
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Daily Care Schedule</h3>
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
                  {task.done && <span style={{ fontSize: "10px", fontWeight: "900" }}>✓</span>}
                </div>
                <span style={{ 
                  fontSize: "13.5px", 
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
