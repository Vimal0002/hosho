"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "../providers";
import Header from "./Header";
import Footer from "./Footer";
import {
  Send, Zap, ShoppingBag, Truck, RotateCcw, Box, User, Terminal,
  History, MessageSquare, AlertCircle, Sparkles, Mic, MicOff,
  Volume2, VolumeX, HelpCircle, X, Menu, Home, ShoppingCart,
  BarChart3, Settings, Moon, Sun, Download, Heart, GitCompare,
  Tag, ChevronRight, Phone, Search, Check, Copy, ThumbsUp
} from "lucide-react";

function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollRef = useRef(null);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Compare Panel
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareItems, setCompareItems] = useState([]);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Stats Bar
  const [statsOpen, setStatsOpen] = useState(true);

  // Theme - use provider hook
  const { isDarkMode, toggleTheme } = useTheme();

  // Voice
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceOrb, setShowVoiceOrb] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("idle"); // idle, listening, processing, speaking
  const [continuousMode, setContinuousMode] = useState(false);
  const recognitionRef = useRef(null);

  // Modals
  const [showHelp, setShowHelp] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState([]);

  // Waveform
  const [waveHeights, setWaveHeights] = useState(Array(12).fill(8));
  const waveIntervalRef = useRef(null);

  // Voice command interpreter for shopping actions
  const interpretVoiceCommand = (transcript) => {
    const text = transcript.toLowerCase().trim();
    
    // Product viewing commands
    if (text.includes("show") && text.includes("product")) {
      return "Show me all available products";
    }
    if (text.includes("view") && text.includes("inventory")) {
      return "Show inventory";
    }
    if (text.includes("search") || text.includes("find")) {
      const match = transcript.match(/(?:search|find)(?:\s+for)?\s+(.+)/i);
      if (match) return `Search for ${match[1]}`;
      return transcript;
    }
    
    // Purchase commands
    if (text.includes("buy") || text.includes("purchase")) {
      const match = transcript.match(/(?:buy|purchase)\s+(.+)/i);
      if (match) return `Add ${match[1]} to my cart`;
      return "Show me products to buy";
    }
    if (text.includes("add to cart")) {
      const match = transcript.match(/add\s+(.+?)\s+to/i);
      if (match) return `Add ${match[1]} to my cart`;
      return transcript;
    }
    
    // Order commands
    if (text.includes("order") || text.includes("checkout")) {
      return "Place my order";
    }
    if (text.includes("my order") || text.includes("order status") || text.includes("order history")) {
      return "Show my order history";
    }
    
    // Cart commands
    if (text.includes("show cart") || text.includes("view cart")) {
      return "Show my cart";
    }
    if (text.includes("clear cart") || text.includes("empty cart")) {
      return "Clear my cart";
    }
    
    // Return original if no specific command matched
    return transcript;
  };

  // Save wishlist
  useEffect(() => {
    localStorage.setItem("electrominds-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const interpretedCommand = interpretVoiceCommand(transcript);
        setInput(interpretedCommand);
        setVoiceStatus("processing");
        handleSend(interpretedCommand);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (voiceStatus === "listening") setVoiceStatus("idle");
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setVoiceStatus("idle");
      };
    }
  }, []);

  // Waveform animation
  useEffect(() => {
    if (isListening || isSpeaking) {
      waveIntervalRef.current = setInterval(() => {
        setWaveHeights(Array(12).fill(0).map(() => Math.random() * 35 + 8));
      }, 120);
    } else {
      if (waveIntervalRef.current) {
        clearInterval(waveIntervalRef.current);
        waveIntervalRef.current = null;
      }
      setWaveHeights(Array(12).fill(8));
    }
    return () => {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [isListening, isSpeaking]);

  // Text to Speech
  const speakText = useCallback((text) => {
    if (!isSpeechEnabled || typeof window === "undefined") return;

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/## (.*?)/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\|/g, "")
      .replace(/[-*] /g, "")
      .replace(/`/g, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 500));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus("speaking");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus("idle");
      // Continuous mode: auto-re-listen
      if (continuousMode && showVoiceOrb) {
        setTimeout(() => startListening(), 500);
      }
    };

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes("Google US English") || v.name.includes("Samantha") || v.lang === "en-US"
    ) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  }, [isSpeechEnabled, continuousMode, showVoiceOrb]);

  // Handle sending messages
  const handleSend = useCallback(async (textOverride) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    setShowWelcome(false);
    const userMsg = { role: "user", parts: [{ text: textToSend }] };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    if (typeof window !== "undefined") window.speechSynthesis.cancel();

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: m.parts,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history }),
      });

      const data = await res.json();

      if (res.ok && data.parts && data.parts[0]) {
        const botResponse = data.parts[0].text;
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: botResponse }] },
        ]);
        speakText(botResponse);
      } else {
        const errorText = data.parts?.[0]?.text || "Communication error. Please check your API Key or connection.";
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: `⚠️ **Error**: ${errorText}` }] },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Network error. Is the server running?" }] },
      ]);
    } finally {
      setLoading(false);
      setVoiceStatus("idle");
    }
  }, [input, messages, speakText]);

  const startListening = () => {
    try {
      recognitionRef.current?.start();
      setIsListening(true);
      setVoiceStatus("listening");
    } catch (e) {
      console.error("Microphone error", e);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setVoiceStatus("idle");
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Toast System
  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.map(t => t.id === id ? { ...t, removing: true } : t));
      setTimeout(() => {
        setToasts((prev) => prev.filter(t => t.id !== id));
      }, 300);
    }, 4000);
  }, []);

  // Message Actions
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Message copied to clipboard!', 'success');
  };

  const handleCompare = (productName) => {
    // Basic mock handling for adding to compare items
    if (compareItems.length >= 3) {
      addToast('Compare list is full (max 3)', 'warning');
      return;
    }
    setCompareItems((prev) => [...prev, { id: Date.now(), name: productName }]);
    setCompareOpen(true);
    addToast(`${productName} added to compare`, 'success');
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick action handlers
  const sendQuickAction = (text) => {
    setInput(text);
    handleSend(text);
  };

  // Sidebar nav handler
  const handleNavAction = (action) => {
    setSidebarOpen(false);
    switch (action) {
      case "new_chat":
        setMessages([]);
        setShowWelcome(true);
        break;
      case "orders":
        sendQuickAction("Show my order history");
        break;
      case "cart":
        sendQuickAction("Show my cart");
        break;
      case "deals":
        sendQuickAction("Show me deals and offers");
        break;
      case "products":
        sendQuickAction("Show products");
        break;
      case "admin":
        sendQuickAction("Show admin dashboard");
        break;
      case "help":
        setShowHelp(true);
        break;
    }
  };

  // Chat export
  const exportChat = () => {
    if (messages.length === 0) return;
    let text = "# ElectroMinds Chat Export\n";
    text += `# Date: ${new Date().toLocaleString()}\n\n`;
    messages.forEach((m) => {
      const role = m.role === "user" ? "You" : "ElectroMinds AI";
      text += `### ${role}\n${m.parts[0].text}\n\n---\n\n`;
    });
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `electrominds-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Voice Orb
  const openVoiceOrb = () => {
    setShowVoiceOrb(true);
    setIsSpeechEnabled(true);
    setTimeout(() => startListening(), 300);
  };

  const closeVoiceOrb = () => {
    stopListening();
    setShowVoiceOrb(false);
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setVoiceStatus("idle");
  };

  const quickActions = [
    { icon: "🛍️", label: "Show Products", cmd: "Show me products" },
    { icon: "📦", label: "Track Order", cmd: "Show my order history" },
    { icon: "🛒", label: "My Cart", cmd: "Show my cart" },
    { icon: "🔥", label: "Deals", cmd: "Recommend popular products" },
    { icon: "💱", label: "Currency", cmd: "Convert 5000 INR to USD" },
    { icon: "🎙️", label: "Voice Chat", cmd: "__VOICE__" },
  ];

  return (
    <>
      <Header />
      <div className="app-container">
      {/* =================== PARTICLES BACKGROUND =================== */}
      <div className="particles-bg">
        {Array(20).fill(0).map((_, i) => (
          <div key={i} className="particle" style={{
            '--left': `${Math.random() * 100}%`,
            '--duration': `${10 + Math.random() * 20}s`,
            '--size': `${2 + Math.random() * 6}px`,
            '--opacity': `${0.1 + Math.random() * 0.4}`,
            '--blur': `${1 + Math.random() * 3}px`
          }} />
        ))}
      </div>

      {/* =================== SIDEBAR =================== */}
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Zap size={22} color="white" />
          </div>
          <div>
            <div className="sidebar-title">ElectroMinds</div>
            <div className="sidebar-subtitle">AI Shopping Assistant</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => handleNavAction("new_chat")}>
            <span className="nav-icon"><Home size={18} /></span>
            New Chat
          </button>
          <button className="nav-item" onClick={() => handleNavAction("products")}>
            <span className="nav-icon"><ShoppingBag size={18} /></span>
            Browse Products
          </button>
          <button className="nav-item" onClick={() => handleNavAction("orders")}>
            <span className="nav-icon"><Truck size={18} /></span>
            My Orders
          </button>
          <button className="nav-item" onClick={() => handleNavAction("cart")}>
            <span className="nav-icon"><ShoppingCart size={18} /></span>
            My Cart
          </button>
          <button className="nav-item" onClick={() => handleNavAction("deals")}>
            <span className="nav-icon"><Tag size={18} /></span>
            Deals & Offers
          </button>

          <div className="nav-divider" />

          <button className="nav-item" onClick={() => handleNavAction("admin")}>
            <span className="nav-icon"><BarChart3 size={18} /></span>
            Admin Dashboard
          </button>
          <button className="nav-item" onClick={() => handleNavAction("help")}>
            <span className="nav-icon"><HelpCircle size={18} /></span>
            Help & Commands
          </button>
          <button className="nav-item" onClick={exportChat}>
            <span className="nav-icon"><Download size={18} /></span>
            Export Chat
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="theme-toggle-container">
            <span className="theme-toggle-label">
              {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </span>
            <div className={`theme-toggle ${isDarkMode ? "active" : ""}`} onClick={toggleTheme}>
              <div className="theme-toggle-knob" />
            </div>
          </div>
          <div className="theme-toggle-container" style={{ marginTop: 8 }}>
            <span className="theme-toggle-label">
              <Volume2 size={14} />
              Voice Replies
            </span>
            <div className={`theme-toggle ${isSpeechEnabled ? "active" : ""}`} onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}>
              <div className="theme-toggle-knob" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 15 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =================== HELP MODAL =================== */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎙️ Commands Guide</h3>
              <button onClick={() => setShowHelp(false)} className="close-btn"><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="cmd-group">
                <h4>🛍️ Shopping</h4>
                <p>"Show me televisions"</p>
                <p>"Buy iPhone 15"</p>
                <p>"Compare iPhone 15 and Galaxy S24"</p>
              </div>
              <div className="cmd-group">
                <h4>🚚 Orders</h4>
                <p>"Track Order ORD123"</p>
                <p>"Show my order history"</p>
                <p>"Cancel Order ORD123"</p>
              </div>
              <div className="cmd-group">
                <h4>🛒 Cart</h4>
                <p>"Add iPhone 15 to cart"</p>
                <p>"Show my cart"</p>
                <p>"Checkout"</p>
              </div>
              <div className="cmd-group">
                <h4>✨ More Features</h4>
                <p>"Recommend popular products"</p>
                <p>"Convert 5000 INR to USD"</p>
                <p>"Return Order ORD123"</p>
                <p>"Show admin dashboard"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================== VOICE ORB OVERLAY =================== */}
      {showVoiceOrb && (
        <div className="voice-orb-overlay">
          <div
            className={`voice-orb ${isListening || isSpeaking ? "active" : ""}`}
            onClick={isListening ? stopListening : startListening}
          >
            <Mic size={48} className="voice-orb-icon" />
          </div>

          <div className="voice-waveform">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                className={`wave-bar ${isListening || isSpeaking ? "active" : ""}`}
                style={{
                  height: `${h}px`,
                  "--max-height": `${20 + Math.random() * 30}px`,
                  "--duration": `${0.4 + Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="voice-status-text">
            {voiceStatus === "listening" && "🎤 Listening..."}
            {voiceStatus === "processing" && "⚡ Processing..."}
            {voiceStatus === "speaking" && "🔊 Speaking..."}
            {voiceStatus === "idle" && "Tap to speak"}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              className="voice-close-btn"
              onClick={() => setContinuousMode(!continuousMode)}
              style={{
                borderColor: continuousMode ? "var(--primary-color)" : undefined,
                color: continuousMode ? "var(--primary-light)" : undefined,
              }}
            >
              {continuousMode ? "🔁 Continuous: ON" : "🔁 Continuous: OFF"}
            </button>
            <button className="voice-close-btn" onClick={closeVoiceOrb}>
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* =================== COMPARE PANEL =================== */}
      <div className={`compare-panel ${compareOpen ? "open" : ""}`}>
        <div className="compare-header">
          <h3><GitCompare size={18} /> Compare Products</h3>
          <button className="close-btn" onClick={() => setCompareOpen(false)}><X size={18} /></button>
        </div>
        
        {compareItems.length === 0 ? (
          <div className="compare-empty">
            <GitCompare size={32} opacity={0.5} />
            <div>No products to compare</div>
            <div style={{fontSize: 11}}>Add products from the chat to compare</div>
          </div>
        ) : (
          <div className="compare-body">
            {compareItems.map(item => (
              <div key={item.id} className="compare-col">
                <button className="remove-compare-btn" onClick={() => setCompareItems(prev => prev.filter(i => i.id !== item.id))}>
                  <X size={12} />
                </button>
                <div className="compare-col-header">
                  <h4>{item.name}</h4>
                </div>
                <div className="spec-item"><span className="spec-label">Price</span><span className="spec-value">TBD</span></div>
                <div className="spec-item"><span className="spec-label">Rating</span><span className="spec-value">TBD</span></div>
                <div className="spec-item"><span className="spec-label">Stock</span><span className="spec-value">TBD</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
      {compareOpen && <div className="compare-panel-overlay" onClick={() => setCompareOpen(false)} />}

      {/* =================== TOAST NOTIFICATIONS =================== */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.removing ? 'removing' : ''}`}>
            {toast.type === 'success' && <Check size={18} className="toast-icon success" />}
            {toast.type === 'info' && <AlertCircle size={18} className="toast-icon info" />}
            {toast.type === 'warning' && <AlertCircle size={18} className="toast-icon warning" />}
            {toast.type === 'error' && <X size={18} className="toast-icon error" />}
            <span>{toast.msg}</span>
          </div>
        ))}
      </div>

      {/* =================== MAIN CHAT =================== */}
      <main className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} id="sidebar-toggle" aria-label="Toggle sidebar">
              <Menu size={20} />
            </button>
            <div className="header-profile">
              <div className="avatar bot-profile">
                <Zap size={22} color="white" fill="white" />
              </div>
              <div className="header-info">
                <div className="header-name">ElectroMinds AI</div>
                <div className="header-status">
                  <span className="status-dot" />
                  Online
                </div>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="header-btn" onClick={() => setShowHelp(true)} title="Commands Guide" id="help-btn">
              <HelpCircle size={18} />
            </button>
            <button
              className={`header-btn ${isSpeechEnabled ? "active" : ""}`}
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              title={isSpeechEnabled ? "Mute Voice" : "Enable Voice"}
              id="voice-toggle-btn"
            >
              {isSpeechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button className="header-btn" onClick={openVoiceOrb} title="Voice Assistant" id="voice-orb-btn">
              <Mic size={18} />
            </button>
            {messages.length > 0 && (
              <button className="header-btn" onClick={exportChat} title="Export Chat" id="export-btn">
                <Download size={18} />
              </button>
            )}
            <button className="header-btn" onClick={() => setSearchOpen(!searchOpen)} title="Search Chat">
              <Search size={18} />
            </button>
            <button className="header-btn" onClick={() => setCompareOpen(!compareOpen)} title="Compare Products">
              <GitCompare size={18} />
            </button>
          </div>
        </header>

        {/* Stats Bar */}
        {statsOpen && (
          <div className="stats-bar">
             <div className="stat-item"><ShoppingCart size={14} /> <span className="stat-value">Cart: 0</span></div>
             <div className="stat-item"><Truck size={14} /> <span className="stat-value">Orders: 0</span></div>
             <div className="stat-item"><MessageSquare size={14} /> <span className="stat-value">Msgs: {messages.length}</span></div>
          </div>
        )}

        {/* Search Overlay */}
        {searchOpen && (
          <div className="search-bar-container">
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              className="chat-search-input" 
              placeholder="Search in chat..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="close-btn" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}><X size={16} /></button>
          </div>
        )}

        {/* Messages or Welcome */}
        <div className="messages-area" ref={scrollRef}>
          {showWelcome && messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-logo">
                <Zap size={36} color="white" />
              </div>
              <div className="welcome-title">
                {new Date().getHours() < 12 ? "Good morning!" : new Date().getHours() < 18 ? "Good afternoon!" : "Good evening!"}
              </div>
              <div className="welcome-subtitle" style={{ animation: 'typing 2s steps(40, end)'}}>
                Your intelligent shopping assistant. How can I help you today?
              </div>
              <div className="welcome-features" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '700px' }}>
                <button className="welcome-feature" onClick={() => sendQuickAction("Show me products")}>
                  <span className="feature-icon">🛍️</span>
                  <div>
                    <strong>Browse Products</strong>
                    <div style={{fontSize: '10px', color: 'var(--text-muted)'}}>Explore our catalog</div>
                  </div>
                </button>
                <button className="welcome-feature" onClick={() => sendQuickAction("Recommend popular products")}>
                  <span className="feature-icon">🔥</span>
                  <div>
                    <strong>Trending Now</strong>
                    <div style={{fontSize: '10px', color: 'var(--text-muted)'}}>See what's popular</div>
                  </div>
                </button>
                <button className="welcome-feature" onClick={() => sendQuickAction("Show my order history")}>
                  <span className="feature-icon">📦</span>
                  <div>
                    <strong>Track Orders</strong>
                    <div style={{fontSize: '10px', color: 'var(--text-muted)'}}>Check your past orders</div>
                  </div>
                </button>
                <button className="welcome-feature" onClick={openVoiceOrb}>
                  <span className="feature-icon">🎙️</span>
                  <div>
                    <strong>Voice Assistant</strong>
                    <div style={{fontSize: '10px', color: 'var(--text-muted)'}}>Speak to search</div>
                  </div>
                </button>
                <button className="welcome-feature" onClick={() => sendQuickAction("Compare MacBook Air and Dell XPS")}>
                  <span className="feature-icon">⚖️</span>
                  <div>
                    <strong>Compare</strong>
                    <div style={{fontSize: '10px', color: 'var(--text-muted)'}}>Side by side specs</div>
                  </div>
                </button>
                <button className="welcome-feature" onClick={() => sendQuickAction("Show admin dashboard")}>
                  <span className="feature-icon">📊</span>
                  <div>
                    <strong>Dashboard</strong>
                    <div style={{fontSize: '10px', color: 'var(--text-muted)'}}>View admin stats</div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                // Apply search highlight if querying
                const text = msg.parts[0].text;
                const isMatch = searchQuery && text.toLowerCase().includes(searchQuery.toLowerCase());
                
                return (
                  <div key={idx} className={`message ${msg.role === "user" ? "user" : "bot"} ${isMatch ? "highlight-message" : ""}`}>
                    <div className={`avatar ${msg.role === "user" ? "user" : "bot"}`}>
                      {msg.role === "user" ? <User size={18} /> : <Sparkles size={18} />}
                    </div>
                    <div className="bubble-content" style={{ border: isMatch ? '2px solid var(--primary-light)' : undefined }}>
                      {msg.role === "model" ? (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        text
                      )}
                      
                      {/* Message Actions */}
                      <div className="message-meta">
                        <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {msg.role === "model" && (
                          <>
                            <button className="msg-action" onClick={() => handleCopy(text)} title="Copy"><Copy size={12}/></button>
                            <button className="msg-reaction" title="Thumbs up"><ThumbsUp size={12}/></button>
                          </>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="message bot">
                  <div className="avatar bot"><Sparkles size={18} /></div>
                  <div className="bubble-content">
                    <div className="dots">
                      <div className="dot-anim" />
                      <div className="dot-anim" />
                      <div className="dot-anim" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && !showWelcome && (
          <div className="quick-actions">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                className="action-chip"
                onClick={() => {
                  if (qa.cmd === "__VOICE__") {
                    openVoiceOrb();
                  } else {
                    sendQuickAction(qa.cmd);
                  }
                }}
              >
                <span className="chip-icon">{qa.icon}</span>
                {qa.label}
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <div className="composer-area">
          <div className={`input-wrapper ${isListening ? "listening-pulse" : ""}`}>
            <button
              className={`voice-input-btn ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              title="Voice Input"
              id="voice-input-btn"
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              className="chat-input"
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
              id="chat-input"
            />

            <button
              className="send-btn"
              onClick={() => handleSend()}
              disabled={loading || (!input.trim() && !isListening)}
              id="send-btn"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </>
  );
}
export default HomePage
