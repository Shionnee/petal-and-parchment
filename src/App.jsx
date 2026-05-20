import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import CareTasks from "./components/CareTasks";
import Scanner from "./components/Scanner";
import PlantDossier from "./components/PlantDossier";
import BotanistChat from "./components/BotanistChat";
import Settings from "./components/Settings";
import Navigation from "./components/Navigation";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [theme, setTheme] = useState(() => localStorage.getItem("verdant_theme") || "light");
  const [layoutMode, setLayoutMode] = useState(() => localStorage.getItem("verdant_layout_mode") || "mobile");
  
  // State from localStorage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("verdant_gemini_key") || "");
  const [savedPlants, setSavedPlants] = useState(() => {
    try {
      const stored = localStorage.getItem("verdant_saved_plants");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Navigation sub-views
  const [viewingDossierPlant, setViewingDossierPlant] = useState(null);
  
  // Grounding chat context
  const [chatContextPlant, setChatContextPlant] = useState(null);

  // Sync saved plants to localStorage
  useEffect(() => {
    localStorage.setItem("verdant_saved_plants", JSON.stringify(savedPlants));
  }, [savedPlants]);

  // Sync theme to document element
  useEffect(() => {
    localStorage.setItem("verdant_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync layout mode to document element
  useEffect(() => {
    localStorage.setItem("verdant_layout_mode", layoutMode);
    document.documentElement.setAttribute("data-layout-mode", layoutMode);
  }, [layoutMode]);

  // Sync API key to localStorage
  const handleSaveApiKey = (key) => {
    localStorage.setItem("verdant_gemini_key", key);
    setApiKey(key);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("verdant_gemini_key");
    setApiKey("");
  };

  // Hydrate with sample plants
  const handleHydrateGarden = (plants) => {
    setSavedPlants(plants);
  };

  // Check if plant exists in garden
  const isPlantSaved = (plant) => {
    return savedPlants.some(p => p.id === plant.id);
  };

  // Toggle plant save/delete in garden list
  const handleSaveToggle = (plant) => {
    if (isPlantSaved(plant)) {
      setSavedPlants(prev => prev.filter(p => p.id !== plant.id));
    } else {
      setSavedPlants(prev => [plant, ...prev]);
    }
  };

  // When a scan completes
  const handleScanComplete = (diagnosticResult) => {
    // Automatically save scan results to history/garden to make it instant!
    handleSaveToggle(diagnosticResult);
    
    // Switch to home tab but open the dossier immediately so they can read the report!
    setViewingDossierPlant(diagnosticResult);
    setActiveTab("home");
  };

  // Transition from Dossier to Chatbot with grounding context
  const handleConsultAgent = (plant) => {
    setChatContextPlant(plant);
    setActiveTab("chat");
  };

  // Render the appropriate main panel content
  const renderScreenContent = () => {
    switch (activeTab) {
      case "home":
        if (viewingDossierPlant) {
          return (
            <PlantDossier 
              plantData={viewingDossierPlant} 
              onBack={() => setViewingDossierPlant(null)}
              onSaveToggle={handleSaveToggle}
              isSaved={isPlantSaved(viewingDossierPlant)}
              onConsultAgent={handleConsultAgent}
            />
          );
        }
        return (
          <Dashboard 
            savedPlants={savedPlants}
            onSelectPlant={(plant) => setViewingDossierPlant(plant)}
            onNavigateToScan={() => setActiveTab("scan")}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === "light" ? "dark" : "light")}
            apiKey={apiKey}
            onNavigateToSettings={() => setActiveTab("settings")}
          />
        );
        
      case "tasks":
        return (
          <CareTasks />
        );
        
      case "scan":
        return (
          <Scanner 
            apiKey={apiKey}
            onScanComplete={handleScanComplete}
            onCancel={() => setActiveTab("home")}
          />
        );
        
      case "chat":
        return (
          <BotanistChat 
            apiKey={apiKey}
            activePlantContext={chatContextPlant}
            onClearContext={() => setChatContextPlant(null)}
          />
        );
        
      case "settings":
        return (
          <Settings 
            apiKey={apiKey}
            onSaveApiKey={handleSaveApiKey}
            onClearApiKey={handleClearApiKey}
            onHydrateGarden={handleHydrateGarden}
            theme={theme}
            onToggleTheme={(t) => setTheme(t)}
            layoutMode={layoutMode}
            onToggleLayoutMode={(l) => setLayoutMode(l)}
          />
        );
        
      default:
        return (
          <Dashboard 
            savedPlants={savedPlants}
            onSelectPlant={(plant) => setViewingDossierPlant(plant)}
            onNavigateToScan={() => setActiveTab("scan")}
            apiKey={apiKey}
            onNavigateToSettings={() => setActiveTab("settings")}
          />
        );
    }
  };

  return (
    <div className={layoutMode === "mobile" ? "phone-frame" : "webapp-frame"}>
      {/* Ambient Magical Forest Fairy Lights */}
      <div className="magical-orb orb-1"></div>
      <div className="magical-orb orb-2"></div>
      <div className="magical-orb orb-3"></div>

      <div className="app-viewport" style={{ zIndex: 1, background: "transparent" }}>
        {renderScreenContent()}
        
        {/* Navigation bottom bar (only if not actively scanning, which occupies full viewport) */}
        {activeTab !== "scan" && (
          <Navigation 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              // Reset dossier viewing when moving tab
              if (tab !== "home") setViewingDossierPlant(null);
              setActiveTab(tab);
            }} 
          />
        )}
      </div>
    </div>
  );
}
