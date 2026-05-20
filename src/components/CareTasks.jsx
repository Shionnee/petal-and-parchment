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
      <h2 style={{ fontSize: "22px", marginBottom: "6px", marginTop: "10px" }}>Care Schedule</h2>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "20px" }}>
        Nurture your garden with daily botanical rituals.
      </p>

      {/* Progress Card */}
      <div className="glass-card" style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ fontSize: "14px" }}>Today's Rituals Completed</h4>
            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{completedCount} of {tasks.length} tasks done</p>
          </div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--secondary)" }}>
            {progressPercent}%
          </div>
        </div>
        
        {/* Ethereal progress track */}
        <div style={{ width: "100%", height: "6px", background: "rgba(181, 149, 86, 0.08)", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, var(--primary), var(--secondary))", borderRadius: "99px", transition: "width var(--t-normal)" }}></div>
        </div>
      </div>

      {/* Task List */}
      <div className="todo-list">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`todo-item ${task.done ? "done" : ""}`}
            onClick={() => toggleTask(task.id)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className={`todo-checkbox ${task.done ? "checked" : ""}`}>
                {task.done && <span style={{ fontSize: "10px", fontWeight: "900" }}>✓</span>}
              </div>
              <div>
                <span style={{ 
                  fontSize: "13px", 
                  textDecoration: task.done ? "line-through" : "none", 
                  color: task.done ? "var(--text-muted)" : "var(--text-main)",
                  fontWeight: "500",
                  display: "block"
                }}>
                  {task.action}
                </span>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                  {task.plant} • {task.time}
                </span>
              </div>
            </div>
            {getActionIcon(task.type)}
          </div>
        ))}
      </div>

      {/* Motivation completion card */}
      {progressPercent === 100 && (
        <div className="glass-card" style={{ marginTop: "20px", textAlign: "center", background: "rgba(74, 114, 94, 0.05)", borderColor: "var(--primary)" }}>
          <Award size={24} style={{ color: "var(--secondary)", margin: "0 auto 8px auto" }} />
          <h4 style={{ color: "var(--primary)" }}>All Rituals Complete!</h4>
          <p style={{ fontSize: "12px", marginTop: "4px" }}>Your forest sanctuary is glowing with vibrant health today.</p>
        </div>
      )}
    </div>
  );
}
