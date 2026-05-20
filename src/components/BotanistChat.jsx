import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, AlertCircle, X as LucideX } from "lucide-react";
import { chatWithBotanistAgent, getMockBotanistResponse, checkPromptInjection } from "../utils/geminiService";

// specialized botanical agents configuration
const AGENTS = [
  {
    id: "sage",
    name: "Dr. Sage",
    role: "Plant MD 🧑‍🔬",
    avatar: "🧑‍🔬",
    tagline: "Botanical Pathology & Diagnostics",
    welcome: "Hello! I am **Dr. Sage**, your digital botanist and plant pathologist.\n\nAsk me about leaf spot diagnoses, pest infestations, or medical recovery procedures for your plant companion. How can I treat your plant today?",
    placeholder: "Ask about symptoms, treatments, bugs...",
    suggestedPrompts: [
      "How to eradicate spider mites?",
      "Why do lower leaves turn yellow?",
      "DIY neem oil recipe?"
    ]
  },
  {
    id: "flora",
    name: "Flora",
    role: "Care Alchemist 🧪",
    avatar: "🧪",
    tagline: "Substrates, Hydration & Propagation",
    welcome: "Greetings, soil digger! I am **Flora**, your Soil & Care Alchemist. Let's brew the perfect soil mix or outline your hydration dynamics.\n\nAsk me about potting substrates, bottom-watering, and node propagation!",
    placeholder: "Ask about potting soil mix, watering, nodes...",
    suggestedPrompts: [
      "Custom airy soil recipe?",
      "How to propagate in water?",
      "What is bottom watering?"
    ]
  },
  {
    id: "moss",
    name: "Moss",
    role: "Green Whisperer 🌿",
    avatar: "🌿",
    tagline: "Styling, Light Mapping & Companions",
    welcome: "Welcome to my canopy! I am **Moss**, your Green Whisperer and indoor layout designer. Let's arrange your plant to create a poetic green sanctuary.\n\nAsk me about interior styling, companion planting, and vessel materials!",
    placeholder: "Ask about companion plants, styling, pots...",
    suggestedPrompts: [
      "Which plants look good together?",
      "Is terracotta pot best?",
      "Best low-light shelf plants?"
    ]
  }
];

export default function BotanistChat({ apiKey, activePlantContext, onClearContext }) {
  const [activeAgentId, setActiveAgentId] = useState("sage");
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const prevPlantContextIdRef = useRef(null);

  // Independent chat memory slots per agent
  const [messagesByAgent, setMessagesByAgent] = useState({
    sage: [
      {
        id: "welcome_sage",
        sender: "bot",
        text: AGENTS[0].welcome
      }
    ],
    flora: [
      {
        id: "welcome_flora",
        sender: "bot",
        text: AGENTS[1].welcome
      }
    ],
    moss: [
      {
        id: "welcome_moss",
        sender: "bot",
        text: AGENTS[2].welcome
      }
    ]
  });

  // Dynamic system greeting synchronization when focus plant context shifts
  useEffect(() => {
    const currentId = activePlantContext?.id || null;
    if (currentId === prevPlantContextIdRef.current) {
      return; // Do nothing if context hasn't actually changed
    }
    prevPlantContextIdRef.current = currentId;

    if (activePlantContext) {
      const plantName = activePlantContext.plantName;
      const condition = activePlantContext.conditionName;
      const score = activePlantContext.healthScore;
      const timestamp = Date.now();

      setMessagesByAgent(prev => ({
        sage: [
          ...prev.sage,
          {
            id: `context_sage_${timestamp}`,
            sender: "bot",
            text: `I have analyzed the health records for your **${plantName}**, which was diagnosed with **${condition}** (Health Score: ${score}/100).\n\nI am fully prepared to advise you on organic treatment remedies, symptoms, and medical recovery. Let's cure your plant!`
          }
        ],
        flora: [
          ...prev.flora,
          {
            id: `context_flora_${timestamp}`,
            sender: "bot",
            text: `I see your **${plantName}** is recovering from **${condition}** (Health Score: ${score}/100).\n\nLet's design a watering schedule that prevents root stress and mix a premium custom soil recipe to help it recover. Ask me any propagation or substrate question!`
          }
        ],
        moss: [
          ...prev.moss,
          {
            id: `context_moss_${timestamp}`,
            sender: "bot",
            text: `Your lovely **${plantName}** is in focus, dealing with **${condition}**.\n\nLet's map out the perfect lighting angles and style it with ideal companion plants to make it a gorgeous centerpiece. How shall we design its living space?`
          }
        ]
      }));
    } else {
      // Non-destructive context clear notice
      const timestamp = Date.now();
      setMessagesByAgent(prev => {
        const hasMessagesSage = prev.sage.length > 1;
        const hasMessagesFlora = prev.flora.length > 1;
        const hasMessagesMoss = prev.moss.length > 1;

        if (!hasMessagesSage && !hasMessagesFlora && !hasMessagesMoss) {
          return prev;
        }

        return {
          sage: hasMessagesSage ? [
            ...prev.sage,
            {
              id: `context_clear_sage_${timestamp}`,
              sender: "bot",
              text: `Plant context has been cleared. I am ready to answer any general plant care or disease questions!`
            }
          ] : prev.sage,
          flora: hasMessagesFlora ? [
            ...prev.flora,
            {
              id: `context_clear_flora_${timestamp}`,
              sender: "bot",
              text: `Plant context has been cleared. Let me know if you need any general advice on soil recipes or propagation!`
            }
          ] : prev.flora,
          moss: hasMessagesMoss ? [
            ...prev.moss,
            {
              id: `context_clear_moss_${timestamp}`,
              sender: "bot",
              text: `Plant context has been cleared. Ask me any general questions about container styling or indoor landscaping!`
            }
          ] : prev.moss
        };
      });
    }
  }, [activePlantContext]);

  // Scroll active window on messaging or agent toggle
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByAgent, activeAgentId, loading]);

  // Markdown parsing helper for bold and linebreaks
  const parseMarkdown = (text) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const parts = line.split(/\*\*([\s\S]*?)\*\*/g);
      const parsedElements = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return <strong key={partIdx} style={{ color: "var(--secondary)", fontWeight: "600" }}>{part}</strong>;
        }
        return part;
      });

      return (
        <span key={lineIdx} style={{ display: "block", minHeight: line.trim() === "" ? "12px" : "auto" }}>
          {parsedElements}
        </span>
      );
    });
  };

  // Submit message to active agent
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    if (!textToSend) setInputVal("");

    const activeAgent = AGENTS.find(a => a.id === activeAgentId) || AGENTS[0];
    const agentName = activeAgent.name;
    const agentRole = activeAgentId === "flora" ? "your soil and care alchemist" : activeAgentId === "moss" ? "your green whispering designer" : "your digital botanist companion";

    // Pre-flight client-side security override protection
    if (checkPromptInjection(text)) {
      const userMessage = {
        id: `user_${Date.now()}`,
        sender: "user",
        text: text
      };
      setMessagesByAgent(prev => ({
        ...prev,
        [activeAgentId]: [...prev[activeAgentId], userMessage]
      }));
      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 800));

      setMessagesByAgent(prev => ({
        ...prev,
        [activeAgentId]: [
          ...prev[activeAgentId],
          {
            id: `security_${Date.now()}`,
            sender: "bot",
            text: `Security Notification: A potential prompt override attempt was blocked. I am ${agentName}, ${agentRole}. I am fully committed to advising you on plant care in my specialized domain and cannot deviate from this role. Let's get back to nurturing your garden!`
          }
        ]
      }));
      setLoading(false);
      return;
    }

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: text
    };

    setMessagesByAgent(prev => ({
      ...prev,
      [activeAgentId]: [...prev[activeAgentId], userMessage]
    }));
    setLoading(true);

    try {
      let botText = "";

      if (apiKey && activePlantContext) {
        // --- REAL AI AGENT CALL ---
        const chatHistoryForGemini = messagesByAgent[activeAgentId].map(m => ({
          sender: m.sender,
          text: m.text
        }));
        chatHistoryForGemini.push({ sender: "user", text: text });

        botText = await chatWithBotanistAgent(chatHistoryForGemini, text, activePlantContext, apiKey, activeAgentId);
      } else {
        // --- SIMULATED MOCK BOTANIST COUNCIL RESPONSES ---
        await new Promise(resolve => setTimeout(resolve, 1200));
        const context = activePlantContext || {
          plantName: "houseplant",
          conditionName: "healthy condition",
          severity: "healthy",
          healthScore: 100,
          diagnosisDescription: "No active diagnostics have been run.",
          light: "Filtered lighting",
          treatment: []
        };
        botText = getMockBotanistResponse(text, context, messagesByAgent[activeAgentId], activeAgentId);
      }

      setMessagesByAgent(prev => ({
        ...prev,
        [activeAgentId]: [
          ...prev[activeAgentId],
          {
            id: `bot_${Date.now()}`,
            sender: "bot",
            text: botText
          }
        ]
      }));
    } catch (err) {
      console.error(err);
      setMessagesByAgent(prev => ({
        ...prev,
        [activeAgentId]: [
          ...prev[activeAgentId],
          {
            id: `err_${Date.now()}`,
            sender: "bot",
            text: `My apologies. I encountered an organic node error while processing your request. Please check your credentials or try re-framing your question.`
          }
        ]
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Dynamic Smart care suggested pills based on plant condition + active agent domain
  const getSuggestedPrompts = () => {
    if (!activePlantContext) {
      const activeAgent = AGENTS.find(a => a.id === activeAgentId) || AGENTS[0];
      return activeAgent.suggestedPrompts;
    }

    const cond = activePlantContext.conditionId;

    if (activeAgentId === "flora") {
      return [
        "What is the best soil recipe for this?",
        "When and how to propagate it?",
        "Explain bottom watering tips."
      ];
    }

    if (activeAgentId === "moss") {
      return [
        "Which companions fit its style?",
        "Terracotta vs. ceramic container?",
        "Where is the perfect room location?"
      ];
    }

    // Default Sage (Plant MD)
    if (cond === "healthy") {
      return [
        "How should I fertilize it?",
        "Wiping dust off leaves?",
        "When is the best time to repot?"
      ];
    }
    if (cond?.includes("overwater") || cond?.includes("rot") || cond?.includes("edema")) {
      return [
        "How do I inspect/trim rotten roots?",
        "What soil mix prevents root rot?",
        "How long to wait before watering?"
      ];
    }
    if (cond?.includes("underwater") || cond?.includes("dramatic")) {
      return [
        "What is bottom watering?",
        "How do I fix hydrophobic soil?",
        "Pruning dry brown edges?"
      ];
    }
    if (cond?.includes("pest") || cond?.includes("mite")) {
      return [
        "DIY neem oil spray recipe?",
        "How do spider mites spread?",
        "Should I prune infected leaves?"
      ];
    }

    return [
      "Explain the recovery rules.",
      "How to speed up healing?",
      "Ask general treatment tip."
    ];
  };

  const activeAgent = AGENTS.find(a => a.id === activeAgentId) || AGENTS[0];
  const suggestedPrompts = getSuggestedPrompts();
  const currentMessages = messagesByAgent[activeAgentId];

  // Dynamic description for the active agent in the sidebar
  const getSidebarAgentInfo = () => {
    switch (activeAgentId) {
      case "flora":
        return {
          title: "Flora Care Alchemy Lab 🧪",
          desc: "Consult our soil and care alchemist about custom substrate mixes, bottom-watering methods, propagation node cuttings, and root system humidity."
        };
      case "moss":
        return {
          title: "Moss Canopy Studio 🌿",
          desc: "Arrange your space with our green whisperer. Ask about architectural plant styling, ideal companion groupings, light mapping, and pot choices."
        };
      default:
        return {
          title: "Dr. Sage Clinical Console 🧑‍🔬",
          desc: "Examine health reports, leaf spot symptoms, and pest infestations. Dr. Sage provides organic treatment formulas and medical recovery timelines."
        };
    }
  };

  const sidebarInfo = getSidebarAgentInfo();

  return (
    <div className="screen-container" style={{ padding: "0" }}>
      <div className="chat-container">
        
        {/* Left Column: Sidebar (Dynamic on desktop, hidden descriptions on mobile) */}
        <div className="chat-sidebar">
          {/* Dynamic Console Card (hidden on mobile via CSS) */}
          <div className="chat-sidebar-desc">
            <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--primary)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              {activeAgent.avatar} {sidebarInfo.title}
            </h4>
            <p style={{ fontSize: "12px", color: "var(--text-sub)", lineHeight: "1.5" }}>
              {sidebarInfo.desc}
            </p>
            {activePlantContext && (
              <div style={{ 
                marginTop: "10px", 
                padding: "8px 12px", 
                background: "var(--primary-glow)", 
                border: "1px solid var(--border-glass)", 
                borderRadius: "16px",
                fontSize: "11px",
                color: "var(--text-sub)"
              }}>
                🌱 Grounded on active diagnostics report of <strong>{activePlantContext.plantName}</strong>.
              </div>
            )}
          </div>

          {/* 🌟 Segmented Multi-Agent Switcher Bar */}
          <div className="chat-sidebar-switcher" style={{ width: "100%" }}>
            <div 
              style={{
                display: "flex",
                background: "var(--bg-card)",
                border: "1px solid var(--border-glass)",
                borderRadius: "99px",
                padding: "4px",
                gap: "4px",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              {AGENTS.map((agent) => {
                const isActive = agent.id === activeAgentId;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgentId(agent.id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                      padding: "6px 2px",
                      border: "none",
                      borderRadius: "99px",
                      background: isActive ? "var(--primary-glow)" : "transparent",
                      color: isActive ? "var(--primary)" : "var(--text-sub)",
                      cursor: "pointer",
                      transition: "all var(--t-normal)",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                      border: isActive ? "1px solid var(--border-glow)" : "1px solid transparent",
                      boxShadow: isActive ? "var(--shadow-sm)" : "none",
                      outline: "none"
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{agent.avatar}</span>
                    <span style={{ fontSize: "10px", fontWeight: isActive ? "700" : "500", letterSpacing: "0.2px" }}>
                      {agent.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Plant Context Banner (only inside sidebar for a consolidated stack) */}
          {activePlantContext && (
            <div style={{ 
              padding: "8px 14px", 
              background: "var(--bg-card)", 
              border: "1px solid var(--border-glass)", 
              borderRadius: "99px", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              boxShadow: "var(--shadow-sm)",
              width: "100%"
            }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-sub)", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)" }}></span>
                Focus: <strong style={{ color: "var(--text-main)", fontWeight: "600" }}>{activePlantContext.plantName}</strong>
              </span>
              <button 
                onClick={onClearContext}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "2px",
                  borderRadius: "50%",
                  transition: "color var(--t-fast)"
                }}
                title="Clear Active Plant Focus"
              >
                <LucideX size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Chat Window Console */}
        <div className="chat-main">
          {/* Chat Dynamic Header */}
          <div className="chat-header" style={{ padding: "16px 20px 12px 20px" }}>
            <div 
              className="avatar animate-pop"
              key={`avatar_${activeAgentId}`}
              style={{ 
                fontSize: "20px", 
                fontStyle: "normal", 
                background: "var(--primary-glow)", 
                border: "1px solid var(--border-glass)", 
                borderRadius: "50%", 
                width: "42px", 
                height: "42px", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center" 
              }}
            >
              {activeAgent.avatar}
            </div>
            <div className="botanist-info" style={{ flex: 1, marginLeft: "12px" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {activeAgent.name}
                <span style={{ fontSize: "9px", fontWeight: "700", padding: "2px 6px", borderRadius: "99px", background: "var(--primary-glow)", color: "var(--primary)", border: "1px solid rgba(74, 114, 94, 0.12)" }}>
                  {activeAgent.role.split(" ").slice(-1)[0]}
                </span>
              </h3>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                {activeAgent.tagline}
              </p>
            </div>
            {activePlantContext && (
              <button 
                onClick={onClearContext}
                className="camera-utility-btn" 
                style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}
                title="Clear Active Plant Focus"
              >
                <LucideX size={14} />
              </button>
            )}
          </div>

          {/* Chat Logs Window */}
          <div className="chat-history" style={{ padding: "0 20px" }}>
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender} ${msg.sender === "bot" ? activeAgentId : ""}`}>
                {msg.sender === "bot" ? parseMarkdown(msg.text) : <p>{msg.text}</p>}
              </div>
            ))}

            {/* Typing Loading Indicator */}
            {loading && (
              <div className={`chat-typing-indicator ${activeAgentId}`}>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Message Input & Quick Suggested Pills Bar */}
          <div style={{ padding: "10px 20px 0 20px", display: "flex", flexDirection: "column" }}>
            
            {/* Dynamic Suggestion Pills */}
            <div className="chat-suggested-prompts">
              {suggestedPrompts.map((p, idx) => (
                <button 
                  key={idx} 
                  className="chat-prompt-pill"
                  onClick={() => handleSendMessage(p)}
                  disabled={loading}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Typing Area */}
            <div className="chat-input-area">
              <input 
                type="text" 
                placeholder={activePlantContext ? `Ask ${activeAgent.name} about this plant...` : activeAgent.placeholder}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button 
                className="chat-send-btn" 
                onClick={() => handleSendMessage()}
                disabled={!inputVal.trim() || loading}
                aria-label="Send Message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
