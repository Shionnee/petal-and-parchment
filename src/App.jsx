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

  // Helper to load localStorage with automatic legacy fallback migration
  const getStoredItem = (newKey, oldKey, defaultValue) => {
    try {
      const val = localStorage.getItem(newKey);
      if (val !== null) return val;
      const oldVal = localStorage.getItem(oldKey);
      if (oldVal !== null) {
        localStorage.setItem(newKey, oldVal);
        localStorage.removeItem(oldKey); // Clean up legacy key
        return oldVal;
      }
    } catch (e) {
      console.warn("Storage migration failed", e);
    }
    return defaultValue;
  };

  const [theme, setTheme] = useState(() => getStoredItem("petal_parchment_theme", "verdant_theme", "light"));
  const [layoutMode, setLayoutMode] = useState(() => {
    const saved = getStoredItem("petal_parchment_layout_mode", "verdant_layout_mode", null);
    if (saved !== null) return saved;
    
    // Auto-detect based on User Agent and viewport screen size
    const isMobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    return (isMobileUA || isSmallScreen) ? "mobile" : "webapp";
  });
  
  // State from localStorage
  const [apiKey, setApiKey] = useState(() => getStoredItem("petal_parchment_gemini_key", "verdant_gemini_key", ""));
  const [savedPlants, setSavedPlants] = useState(() => {
    try {
      const stored = getStoredItem("petal_parchment_saved_plants", "verdant_saved_plants", null);
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
    localStorage.setItem("petal_parchment_saved_plants", JSON.stringify(savedPlants));
  }, [savedPlants]);

  // Sync theme to document element
  useEffect(() => {
    localStorage.setItem("petal_parchment_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync layout mode to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-layout-mode", layoutMode);
  }, [layoutMode]);

  // Handler for explicit layout mode changes (saves user selection to localStorage)
  const handleToggleLayoutMode = (mode) => {
    localStorage.setItem("petal_parchment_layout_mode", mode);
    setLayoutMode(mode);
  };

  // Auto-detect layout mode on viewport resize if no explicit preference is set
  useEffect(() => {
    const savedPreference = localStorage.getItem("petal_parchment_layout_mode") || localStorage.getItem("verdant_layout_mode");
    
    if (!savedPreference) {
      const handleResize = () => {
        const isSmallScreen = window.innerWidth < 768;
        const isMobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        setLayoutMode((isMobileUA || isSmallScreen) ? "mobile" : "webapp");
      };
      
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Sync API key to localStorage
  const handleSaveApiKey = (key) => {
    localStorage.setItem("petal_parchment_gemini_key", key);
    setApiKey(key);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("petal_parchment_gemini_key");
    localStorage.removeItem("verdant_gemini_key"); // Make sure old key is wiped clean
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
            onSaveApiKey={handleSaveApiKey}
            onClearApiKey={handleClearApiKey}
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
            onToggleLayoutMode={handleToggleLayoutMode}
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
