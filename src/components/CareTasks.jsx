import React, { useState } from "react";
import { Droplets, Wind, Scissors, Sparkles, Award } from "lucide-react";

export default function CareTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, plant: "Monstera Deliciosa", action: "Watering", time: "Morning", done: false, type: "water" },
    { id: 2, plant: "Fiddle Leaf Fig", action: "Wipe Leaves", time: "Morning", done: false, type: "clean" },
    { id: 3, plant: "Peace Lily", action: "Misting", time: "Afternoon", done: false, type: "mist" },
    { id: 4, plant: "Snake Plant", action: "Soil Moisture Check", time: "Evening", done: false, type: "check" },
    { id: 5, plant: "Monstera Deliciosa", action: "Pruning dry tip", time: "Evening", done: false, type: "prune" }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const getActionIcon = (type) => {
    switch (type) {
      case "water": return <Droplets size={16} style={{ color: "var(--info)" }} />;
      case "mist": return <Wind size={16} style={{ color: "var(--primary)" }} />;
      case "prune": return <Scissors size={16} style={{ color: "var(--gold)" }} />;
      default: return <Sparkles size={16} style={{ color: "var(--secondary)" }} />;
    }
  };

  return (
    <div className="screen-container">
      {/* Header section styled with Cormorant Garamond typography */}
      <p style={{ 
        fontSize: "12px", 
        color: "var(--primary)", 
        textTransform: "uppercase", 
        letterSpacing: "1.8px", 
        fontWeight: "600", 
        fontFamily: "var(--font-body)",
        marginBottom: "4px",
        marginTop: "10px"
      }}>
        Sanctuary Planner
      </p>
      <h2 className="italic-serif" style={{ fontSize: "32px", lineHeight: "1.15", marginBottom: "6px", color: "var(--text-main)" }}>
        Care Schedule
      </h2>
      <p style={{ fontSize: "15px", color: "var(--text-sub)", marginBottom: "22px", fontStyle: "italic" }}>
        Nurture your garden with daily botanical rituals.
      </p>

      {/* Progress Card */}
      <div className="glass-card" style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-main)" }}>Today's Rituals Completed</h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{completedCount} of {tasks.length} tasks done</p>
          </div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--secondary)" }}>
            {progressPercent}%
          </div>
        </div>
        
        {/* Ethereal progress track */}
        <div style={{ width: "100%", height: "6px", background: "rgba(181, 149, 86, 0.08)", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, var(--primary), var(--secondary))", borderRadius: "99px", transition: "width var(--t-normal)" }}></div>
        </div>
      </div>

      {/* Premium Linen Notebook Paper Journal Card */}
      <div 
        className="glass-card" 
        style={{ 
          padding: "24px 20px 20px 20px", 
          background: "var(--bg-notebook)", 
          border: "1px solid var(--border-glass)", 
          borderRadius: "24px",
          boxShadow: "var(--shadow-md)",
          position: "relative",
          overflow: "hidden",
          marginBottom: "20px"
        }}
      >
        {/* Vertical red margin line representing notebook paper */}
        <div style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "42px",
          width: "1.2px",
          background: "var(--border-notebook-margin)",
          zIndex: 2
        }} />

        {/* Notebook Header */}
        <h3 className="italic-serif" style={{ 
          fontSize: "22px", 
          marginBottom: "16px", 
          color: "var(--text-main)", 
          paddingLeft: "36px",
          fontStyle: "italic",
          fontWeight: "500"
        }}>
          botanical journal entries
        </h3>

        {/* Lined Task List */}
        <div className="todo-list" style={{ gap: "0", marginTop: "0" }}>
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`todo-item ${task.done ? "done" : ""}`}
              onClick={() => toggleTask(task.id)}
              style={{ 
                cursor: "pointer",
                background: "transparent",
                border: "none",
                borderRadius: "0",
                boxShadow: "none",
                borderBottom: "1px dashed rgba(197, 180, 165, 0.25)",
                padding: "14px 0 14px 36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                transition: "opacity 0.3s ease"
              }}
            >
              {/* Checkbox styled as a delicate circular ring to the left of the margin line */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div 
                  className={`todo-checkbox ${task.done ? "checked" : ""}`}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: task.done ? "1.5px solid var(--secondary)" : "1.5px solid var(--primary)",
                    background: task.done ? "var(--secondary)" : "transparent",
                    transition: "all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    left: "10px",
                    zIndex: 3
                  }}
                >
                  {task.done && <span style={{ fontSize: "11px", fontWeight: "900", color: "white" }}>✓</span>}
                </div>
                <div>
                  <span style={{ 
                    fontSize: "16px", 
                    textDecoration: task.done ? "line-through" : "none", 
                    color: task.done ? "var(--text-muted)" : "var(--text-main)",
                    fontWeight: "600",
                    display: "block",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.2px"
                  }}>
                    {task.action}
                  </span>
                  <span style={{ 
                    fontSize: "13px", 
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                    display: "block",
                    marginTop: "2px"
                  }}>
                    {task.plant} <span style={{ opacity: 0.5 }}>•</span> {task.time}
                  </span>
                </div>
              </div>
              <div style={{ paddingRight: "4px" }}>
                {getActionIcon(task.type)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation completion card */}
      {progressPercent === 100 && (
        <div className="glass-card" style={{ marginTop: "10px", textAlign: "center", background: "rgba(249, 195, 195, 0.08)", borderColor: "var(--border-glow)" }}>
          <Award size={24} style={{ color: "var(--secondary)", margin: "0 auto 8px auto" }} />
          <h4 className="italic-serif" style={{ color: "var(--text-main)", fontSize: "18px" }}>All Rituals Complete!</h4>
          <p style={{ fontSize: "14px", marginTop: "4px", color: "var(--text-sub)" }}>Your forest sanctuary is glowing with vibrant health today.</p>
        </div>
      )}
    </div>
  );
}
