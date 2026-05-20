import React, { useState, useEffect, useRef } from "react";
import { Camera, Upload, AlertCircle, RefreshCw, X, Play, ShieldAlert, Key } from "lucide-react";
import { SIMULATOR_SELECTIONS, getMockDiagnosis } from "../utils/plantDatabase";
import { analyzePlantWithGemini } from "../utils/geminiService";

export default function Scanner({ apiKey, onSaveApiKey, onClearApiKey, onScanComplete, onCancel }) {
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Simulation / Demo choice states
  const [selectedDemoPlant, setSelectedDemoPlant] = useState("monstera");
  const [selectedDemoCondition, setSelectedDemoCondition] = useState("healthy");
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxTab, setSandboxTab] = useState("scenarios"); // "scenarios" or "key"
  const [inputKey, setInputKey] = useState("");
  const [showKeyInputInline, setShowKeyInputInline] = useState(false);

  // Scan state managers
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Auto-start video stream on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Attach stream when video element becomes active in DOM
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(e => console.log("Play interrupted"));
      }
    }
  }, [cameraActive, previewUrl]);

  const startCamera = async () => {
    setErrorMsg("");
    try {
      stopCamera(); // clear active streams

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported by your browser or in this security context (requires HTTPS or localhost).");
      }

      let stream;
      try {
        // Try ideal back-facing camera first (optimal for mobile plant scanning)
        const constraints = {
          video: { facingMode: { ideal: "environment" } },
          audio: false
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstErr) {
        console.warn("Failed with ideal environment constraints, trying basic video constraints:", firstErr);
        try {
          // Fallback to simple video constraints (works for desktop webcams and single lenses)
          const basicConstraints = {
            video: true,
            audio: false
          };
          stream = await navigator.mediaDevices.getUserMedia(basicConstraints);
        } catch (secondErr) {
          throw new Error("Failed to access camera stream. Please check permissions in your browser bar.");
        }
      }

      streamRef.current = stream;
      setCameraActive(true);
      setHasCamera(true);
    } catch (err) {
      console.warn("Camera not available:", err);
      setHasCamera(false);
      setCameraActive(false);
      setErrorMsg(err.message || "Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create temporary object URL for reading into Image
      const tempUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = tempUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        setPreviewUrl(compressedBase64);
        URL.revokeObjectURL(tempUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(tempUrl);
      };

      stopCamera();
      setShowSandbox(false); // Hide sandbox when a real custom photo is uploaded
    }
  };

  // Take shutter photo
  const capturePhoto = () => {
    if (!videoRef.current || !cameraActive) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "plant_capture.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
          
          // Downscale canvas to get compressed base64 directly
          const maxDimension = 400;
          const canvas2 = document.createElement("canvas");
          let width = canvas.width;
          let height = canvas.height;
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          canvas2.width = width;
          canvas2.height = height;
          const ctx2 = canvas2.getContext("2d");
          ctx2.drawImage(canvas, 0, 0, width, height);
          
          const compressedBase64 = canvas2.toDataURL("image/jpeg", 0.75);
          setPreviewUrl(compressedBase64);
          stopCamera();
          setShowSandbox(false); // Hide sandbox when a photo is captured
        }
      }, "image/jpeg", 0.95);
    } catch (err) {
      console.error("Shutter capture failed:", err);
      setErrorMsg("Failed to capture image. Please upload a file instead.");
    }
  };

  // Reset captured state
  const resetScanner = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg("");
    setShowSandbox(false);
    startCamera();
  };

  // Trigger plant analysis (Real API or Simulation)
  const handleScanSubmit = async () => {
    setScanning(true);
    setScanStep(0);
    setErrorMsg("");

    // Start progress timeline step intervals to simulate rich visual computations
    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < 3) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 900);

    try {
      let finalResult;
      
      if (apiKey && selectedFile) {
        // --- REAL AI ANALYZER ---
        finalResult = await analyzePlantWithGemini(selectedFile, apiKey);
        // Add a mock or generic photo if none exists
        finalResult.image = previewUrl;
      } else {
        // --- HIGH FIDELITY SIMULATION MODE ---
        await new Promise((resolve) => setTimeout(resolve, 3600)); // wait for full animations
        
        if (selectedFile) {
          // Dynamic simulated scan of custom user upload
          finalResult = {
            plantName: "Green Companion",
            botanicalName: "Flora domestica",
            family: "Magnoliophyta",
            difficulty: "Easy",
            origin: "Simulated Garden",
            description: "A beautiful plant scanned in simulation mode. Its lush foliage is receiving care guidance.",
            light: "Filtered or bright indirect light.",
            water: "Water thoroughly when the top 2 inches of soil feel dry.",
            humidity: "Moderate indoor humidity (40-60%).",
            temperature: "65-75°F (18-24°C) is ideal.",
            toxicity: "Safe for household pets.",
            conditionName: "Perfect Morning Dew (Healthy)",
            severity: "healthy",
            healthScore: 94,
            diagnosisDescription: "The simulation analysis shows active chloroplast patterns and healthy leaf posture. No significant physiological stress, visual cellular lesions, or active pest infestations were detected on the scanned foliage surface.",
            symptoms: ["Lush, uniform coloration", "Firm and upright leaf structures", "Excellent cellular turgor"],
            causes: ["Consistent watering schedule", "Optimal lighting placement", "Attentive gardener care"],
            treatment: [
              "Step 1: Continue checking soil moisture weekly before watering.",
              "Step 2: Wipe the leaves gently with a damp cloth monthly to remove dust and maximize light absorption.",
              "Step 3: Rotate the container 90 degrees monthly to promote uniform foliage growth."
            ],
            image: previewUrl,
            timestamp: new Date().toISOString(),
            id: `scan_${Math.random().toString(36).substring(2, 9)}`
          };
        } else {
          // Standard pre-baked simulation selections
          finalResult = getMockDiagnosis(selectedDemoPlant, selectedDemoCondition);
          
          const unsplashMocks = {
            monstera_healthy: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80",
            monstera_overwatered: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80",
            monstera_underwatered: "https://images.unsplash.com/photo-1512428813824-f713c2f4b503?w=600&auto=format&fit=crop&q=80",
            monstera_pest_spider_mites: "https://images.unsplash.com/photo-1508500388910-15cc90e21a22?w=600&auto=format&fit=crop&q=80",
            
            fiddle_leaf_healthy: "https://images.unsplash.com/photo-1597055181300-e3633a207518?w=600&auto=format&fit=crop&q=80",
            fiddle_leaf_overwatered_edema: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80",
            fiddle_leaf_underwatered: "https://images.unsplash.com/photo-1598880940375-4a4dd88683c4?w=600&auto=format&fit=crop&q=80",
            
            snake_plant_healthy: "https://images.unsplash.com/photo-1508500388910-15cc90e21a22?w=600&auto=format&fit=crop&q=80",
            snake_plant_root_rot: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&auto=format&fit=crop&q=80",
            
            peace_lily_healthy: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80",
            peace_lily_underwatered_dramatic: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80",
            peace_lily_chlorine_burn: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80",
          };
          
          const photoKey = `${selectedDemoPlant}_${selectedDemoCondition}`;
          finalResult.image = unsplashMocks[photoKey] || "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80";
        }
      }

      clearInterval(interval);
      setScanning(false);
      onScanComplete(finalResult);
    } catch (err) {
      clearInterval(interval);
      setScanning(false);
      setErrorMsg(err.message || "An error occurred during scanning. Please check your image or credentials.");
    }
  };

  // Gather current condition options based on selected simulator plant
  const currentDemoPlantDetails = SIMULATOR_SELECTIONS.find(p => p.plantId === selectedDemoPlant);

  return (
    <div className="scanner-viewport">
      {/* 1. SCANNING TIMELINE ANIMATION OVERLAY */}
      {scanning && (
        <div className="scanning-loader-container">
          <div className="loading-spinner"></div>
          
          <h3 className="italic-serif" style={{ fontSize: "20px", marginBottom: "6px", color: "var(--text-main)" }}>AI Biometrics Core</h3>
          <p style={{ color: "var(--text-sub)", fontSize: "12px", marginBottom: "24px" }}>Analyzing plant organic matrices...</p>

          <div className="scan-progress-timeline">
            <div className={`scan-progress-step ${scanStep === 0 ? "active" : scanStep > 0 ? "completed" : ""}`}>
              <div className="scan-progress-icon"></div>
              <span>Decrypting chloroplast imagery...</span>
            </div>
            <div className={`scan-progress-step ${scanStep === 1 ? "active" : scanStep > 1 ? "completed" : ""}`}>
              <div className="scan-progress-icon"></div>
              <span>Mapping leaf contour geometry...</span>
            </div>
            <div className={`scan-progress-step ${scanStep === 2 ? "active" : scanStep > 2 ? "completed" : ""}`}>
              <div className="scan-progress-icon"></div>
              <span>Evaluating pigment hydration index...</span>
            </div>
            <div className={`scan-progress-step ${scanStep === 3 ? "active" : scanStep > 3 ? "completed" : ""}`}>
              <div className="scan-progress-icon"></div>
              <span>Consulting Council Agents...</span>
            </div>
          </div>
        </div>
      )}

      {/* Camera / Viewport Container */}
      <div className="camera-container">
        {/* Floating Gemini Key Badge if connected */}
        {apiKey && !selectedFile && (
          <div 
            className="glass-card" 
            style={{ 
              position: "absolute", 
              top: "20px", 
              left: "50%", 
              transform: "translateX(-50%)", 
              zIndex: 50, 
              background: "rgba(30, 25, 22, 0.85)", 
              borderColor: "var(--border-glass)", 
              borderRadius: "99px", 
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--secondary)",
              fontSize: "11px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
            }}
          >
            <span className="chat-pulse-dot" style={{ background: "var(--secondary)", width: "6px", height: "6px" }}></span>
            ✨ Gemini AI Live Connected
          </div>
        )}

        {/* Floating Sandbox Simulation Badge if no API key */}
        {!apiKey && !selectedFile && (
          <button 
            onClick={() => {
              setShowSandbox(prev => !prev);
              setSandboxTab("scenarios");
            }}
            className="glass-card" 
            style={{ 
              position: "absolute", 
              top: "20px", 
              left: "50%", 
              transform: "translateX(-50%)", 
              zIndex: 50, 
              background: "rgba(30, 25, 22, 0.85)", 
              borderColor: "var(--border-glass)", 
              borderRadius: "99px", 
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--gold)",
              cursor: "pointer",
              fontSize: "11.5px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              transition: "transform var(--t-fast)"
            }}
          >
            <span className="chat-pulse-dot" style={{ background: "var(--gold)", width: "6px", height: "6px" }}></span>
            🧪 {showSandbox ? "Close Settings" : "Simulation & Key Settings"}
          </button>
        )}

        {cameraActive && hasCamera ? (
          <>
            {/* Live Camera Viewfinder */}
            <video ref={videoRef} className="camera-stream" playsInline muted></video>
            
            {/* HUD Overlay with fine-art wireframe corners (Champagne Gold in index.css) */}
            <div className="scanner-viewfinder">
              <div className="scanner-corner tl"></div>
              <div className="scanner-corner tr"></div>
              <div className="scanner-corner bl"></div>
              <div className="scanner-corner br"></div>
              <div className="scanner-beam"></div>
              
              <div style={{ position: "absolute", top: "16px", left: "16px", fontSize: "9px", fontFamily: "monospace", opacity: 0.6, letterSpacing: "1px", color: "white" }}>
                REC [AUTO]
              </div>
              <div style={{ position: "absolute", bottom: "16px", right: "16px", fontSize: "9px", fontFamily: "monospace", opacity: 0.6, color: "white" }}>
                FOCAL: DYNAMIC
              </div>
            </div>
          </>
        ) : previewUrl ? (
          /* Image Capture / Upload Preview */
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div className="scanner-viewfinder">
              <div className="scanner-corner tl" style={{ borderColor: "#fff" }}></div>
              <div className="scanner-corner tr" style={{ borderColor: "#fff" }}></div>
              <div className="scanner-corner bl" style={{ borderColor: "#fff" }}></div>
              <div className="scanner-corner br" style={{ borderColor: "#fff" }}></div>
            </div>
            <button className="camera-utility-btn" onClick={resetScanner} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(0,0,0,0.6)" }}>
              <X size={18} />
            </button>
          </div>
        ) : (
          /* Camera Blocked/Fallback Upload Dropzone */
          <div style={{ padding: "40px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%" }}>
            <div style={{ 
              width: "76px", 
              height: "76px", 
              borderRadius: "50%", 
              background: "rgba(255, 255, 255, 0.04)", 
              display: "flex", 
              color: "var(--text-muted)", 
              border: "1px solid var(--border-glass)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <Upload size={32} style={{ margin: "auto", color: "var(--primary)" }} />
            </div>
            <div>
              <h3 className="italic-serif" style={{ marginBottom: "6px", color: "white", fontSize: "22px" }}>Import Foliage Imagery</h3>
              <p style={{ fontSize: "12px", maxWidth: "280px", margin: "auto", color: "rgba(255,255,255,0.55)", lineHeight: "1.5" }}>
                Live camera access is restricted or unavailable. Drag and drop or browse a photo file to run diagnosis.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                <button 
                  onClick={startCamera}
                  className="primary-btn" 
                  style={{ 
                    padding: "12px 20px", 
                    fontSize: "13px", 
                    borderRadius: "99px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    background: "var(--gold)",
                    color: "var(--text-main)",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  <RefreshCw size={14} />
                  Retry Camera
                </button>

                <label className="secondary-btn" style={{ padding: "12px 20px", fontSize: "13px", cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "99px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Upload size={16} />
                  Browse Media
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                </label>
              </div>
              
              {!apiKey && (
                <button 
                  onClick={() => {
                    setShowSandbox(true);
                    setSandboxTab("scenarios");
                  }}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "var(--gold)", 
                    fontSize: "12px", 
                    textDecoration: "underline", 
                    cursor: "pointer", 
                    fontWeight: "600",
                    letterSpacing: "0.2px",
                    marginTop: "4px"
                  }}
                >
                  🧪 Or, try sandbox demo scenarios
                </button>
              )}
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="glass-card" style={{ position: "absolute", top: "20px", left: "20px", right: "20px", background: "rgba(214, 123, 123, 0.95)", display: "flex", gap: "10px", padding: "12px 16px", zIndex: 100, border: "none" }}>
            <AlertCircle size={20} style={{ flexShrink: 0, color: "white" }} />
            <p style={{ color: "white", fontSize: "11px", lineHeight: "1.4" }}>{errorMsg}</p>
          </div>
        )}
      </div>

      {/* 2. SCAN CONTROLS (TAKE SHUTTER OR UPLOAD) */}
      {!previewUrl && cameraActive && !showSandbox && (
        <div className="scanner-controls">
          <label className="camera-utility-btn" aria-label="Upload Image">
            <Upload size={18} />
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </label>

          <button className="camera-shutter-btn" onClick={capturePhoto} aria-label="Capture Shutter">
            <div className="camera-shutter-inner"></div>
          </button>

          <button className="camera-utility-btn" onClick={onCancel} aria-label="Cancel">
            <X size={18} />
          </button>
        </div>
      )}

      {/* 3. SIMULATOR DIAGNOSTIC / API KEY DRAWER */}
      {showSandbox && !selectedFile && !scanning && (
        <div className="simulation-selector">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={16} style={{ color: "var(--gold)" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-sub)" }}>
                Scanner Options Panel
              </span>
            </div>
            <button 
              onClick={() => setShowSandbox(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>

          {/* Luxury Settings Tabs */}
          <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid var(--border-glass)", marginBottom: "16px", paddingBottom: "6px" }}>
            <button 
              onClick={() => setSandboxTab("scenarios")}
              style={{
                background: "none",
                border: "none",
                color: sandboxTab === "scenarios" ? "var(--text-main)" : "var(--text-muted)",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                position: "relative",
                padding: "6px 0",
                fontFamily: "var(--font-body)"
              }}
            >
              🧪 Demo Scenarios
              {sandboxTab === "scenarios" && <div style={{ position: "absolute", bottom: "-7px", left: 0, right: 0, height: "2px", background: "var(--secondary)", borderRadius: "1px" }}></div>}
            </button>
            <button 
              onClick={() => setSandboxTab("key")}
              style={{
                background: "none",
                border: "none",
                color: sandboxTab === "key" ? "var(--text-main)" : "var(--text-muted)",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                position: "relative",
                padding: "6px 0",
                fontFamily: "var(--font-body)"
              }}
            >
              🔑 Connect Gemini AI
              {sandboxTab === "key" && <div style={{ position: "absolute", bottom: "-7px", left: 0, right: 0, height: "2px", background: "var(--secondary)", borderRadius: "1px" }}></div>}
            </button>
          </div>

          {/* Tab Contents */}
          {sandboxTab === "scenarios" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Plant selection */}
              <div>
                <label style={{ fontSize: "10px", color: "var(--text-sub)", fontWeight: "600", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.2px" }}>Select Demo Species</label>
                <select 
                  value={selectedDemoPlant}
                  onChange={(e) => {
                    setSelectedDemoPlant(e.target.value);
                    // Auto pick first condition
                    const details = SIMULATOR_SELECTIONS.find(p => p.plantId === e.target.value);
                    setSelectedDemoCondition(details.conditions[0].id);
                  }}
                  className="simulator-dropdown"
                >
                  {SIMULATOR_SELECTIONS.map(p => (
                    <option key={p.plantId} value={p.plantId}>{p.plantName}</option>
                  ))}
                </select>
              </div>

              {/* Condition selection */}
              <div>
                <label style={{ fontSize: "10px", color: "var(--text-sub)", fontWeight: "600", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.2px" }}>Select Health Scenario</label>
                <select 
                  value={selectedDemoCondition}
                  onChange={(e) => setSelectedDemoCondition(e.target.value)}
                  className="simulator-dropdown"
                >
                  {currentDemoPlantDetails?.conditions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Scan Action Button */}
              <button 
                className="primary-btn" 
                onClick={handleScanSubmit} 
                style={{ marginTop: "6px", width: "100%", padding: "12px", display: "flex", justifyContents: "center", alignItems: "center", gap: "8px" }}
              >
                <Play size={16} fill="currentColor" />
                Simulate Visual Scan
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ fontSize: "11.5px", color: "var(--text-sub)", lineHeight: "1.5", marginBottom: "4px" }}>
                Unlock high-fidelity diagnosis using live Google Gemini AI. Enter your API key below. It remains secure inside your browser's private storage.
              </p>
              
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Key size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input 
                    type="password" 
                    value={inputKey} 
                    onChange={(e) => setInputKey(e.target.value)} 
                    placeholder="Enter Gemini API key..." 
                    style={{
                      width: "100%",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "99px",
                      padding: "10px 16px 10px 36px",
                      color: "var(--text-main)",
                      fontSize: "12.5px",
                      outline: "none",
                      fontFamily: "monospace",
                      transition: "border var(--t-fast)"
                    }}
                  />
                </div>
                <button 
                  onClick={() => {
                    if (inputKey.trim()) {
                      onSaveApiKey(inputKey.trim());
                      setShowSandbox(false);
                      setInputKey("");
                    }
                  }}
                  className="primary-btn"
                  style={{ padding: "10px 16px", fontSize: "12px" }}
                >
                  Save
                </button>
              </div>
              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noreferrer" 
                style={{ fontSize: "11px", color: "var(--text-muted)", textDecoration: "underline", alignSelf: "flex-start", marginTop: "2px" }}
              >
                Get a free API Key from Google AI Studio ↗
              </a>
            </div>
          )}
        </div>
      )}

      {/* 4. REAL OR SIMULATED AI DIAGNOSTIC SUBMISSION VIEW (ONCE FILE CAPTURED) */}
      {selectedFile && !scanning && (
        <div className="simulation-selector" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <h4 className="italic-serif" style={{ fontSize: "18px", marginBottom: "4px", color: "var(--text-main)" }}>
              {apiKey ? "Foliage Image Cached" : "Foliage Image Cached (Simulation)"}
            </h4>
            <p style={{ fontSize: "11.5px", color: "var(--text-sub)", lineHeight: "1.5" }}>
              {apiKey 
                ? "Perfect alignment achieved. Your image is ready for deep neural analysis via Gemini 1.5 Flash."
                : "No API Key Connected — Simulated Analysis Active. We will simulate a scientific diagnostic scan on your custom image."}
            </p>
            
            {/* Inline key input if they want to switch to real scan! */}
            {!apiKey && (
              <div style={{ marginTop: "10px" }}>
                {showKeyInputInline ? (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <Key size={12} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input 
                        type="password" 
                        value={inputKey} 
                        onChange={(e) => setInputKey(e.target.value)} 
                        placeholder="Paste key (AIzaSy...)" 
                        style={{
                          width: "100%",
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-glass)",
                          borderRadius: "99px",
                          padding: "8px 12px 8px 30px",
                          color: "var(--text-main)",
                          fontSize: "11.5px",
                          outline: "none",
                          fontFamily: "monospace"
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (inputKey.trim()) {
                          onSaveApiKey(inputKey.trim());
                          setInputKey("");
                          setShowKeyInputInline(false);
                        }
                      }}
                      className="primary-btn"
                      style={{ padding: "8px 14px", fontSize: "11.5px" }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setShowKeyInputInline(false)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "11.5px", cursor: "pointer", marginLeft: "4px" }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowKeyInputInline(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--secondary)",
                      fontSize: "11.5px",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0,
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    🔑 Connect Gemini Key to run real AI scan
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button className="secondary-btn" onClick={resetScanner} style={{ flex: 1, padding: "12px", fontSize: "13px", borderRadius: "99px" }}>
              Retake
            </button>
            <button className="primary-btn" onClick={handleScanSubmit} style={{ flex: 2, padding: "12px", fontSize: "13px", borderRadius: "99px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
              <Play size={14} fill="currentColor" />
              {apiKey ? "Run AI Analysis" : "Simulate AI Scan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
