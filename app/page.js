"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Zap, ShoppingBag, Truck, RotateCcw, Box, User, Terminal, History, MessageSquare, AlertCircle, Sparkles, Mic, MicOff, Volume2, VolumeX, HelpCircle, X } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [{ text: "👋 **Hi there! I'm ElectroMinds AI.**\n\nI can help you browse products 🏷️, track orders 🚚, or manage your account.\n\n**How can I help you today?**" }],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Voice Integration State
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const recognitionRef = useRef(null);

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
        setInput(transcript);
        handleSend(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Text to Speech
  const speakText = (text) => {
    if (!isSpeechEnabled || typeof window === "undefined") return;

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/## (.*?)/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\|/g, '')
      .replace(/[-*] /g, '')
      .replace(/`/g, '');

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    // Attempt to pick a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.lang === 'en-US') || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Microphone access denied or error", e);
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textOverride) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg = { role: "user", parts: [{ text: textToSend }] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    window.speechSynthesis.cancel();

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: history
        }),
      });

      const data = await res.json();

      if (res.ok && data.parts && data.parts[0]) {
        const botResponse = data.parts[0].text;
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: botResponse }] }]);
        speakText(botResponse);
      } else {
        const errorText = data.parts?.[0]?.text || "Communication error. Please check your API Key or connection.";
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: `⚠️ **Error**: ${errorText}` }] }]);
        speakText("Sorry, I encountered an error.");
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: "Network error. Is the server running?" }] }]);
      speakText("I'm having trouble connecting to the network.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-container">
      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🎙️ Voice Commands</h3>
              <button onClick={() => setShowHelp(false)} className="close-btn"><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="cmd-group">
                <h4>🛍️ Shopping</h4>
                <p>"Show me televisions"</p>
                <p>"Buy iPhone 15"</p>
                <p>"Add 2 speakers to cart"</p>
              </div>
              <div className="cmd-group">
                <h4>🚚 Tracking & History</h4>
                <p>"Where is my order?"</p>
                <p>"Track Order 123"</p>
                <p>"Show my order history"</p>
              </div>
              <div className="cmd-group">
                <h4>✏️ Manage Orders</h4>
                <p>"Return Order 123"</p>
                <p>"Cancel my last order"</p>
                <p>"Change address for ORD123"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <main className="chat-container">
        <header className="chat-header">
          <div className="header-profile">
            <div className="avatar bot-profile">
              <Zap size={24} color="white" fill="white" />
            </div>
            <div className="header-info">
              <div className="header-name">ElectroMinds AI</div>
              <div className="header-status">
                <span className="status-dot"></span> Online
              </div>
            </div>
          </div>

          <div className="header-actions" style={{ display: 'flex', gap: '8px' }}>
            <button
              className="icon-btn"
              onClick={() => setShowHelp(true)}
              title="Voice Commands Guide"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <HelpCircle size={24} />
            </button>

            <button
              className={`icon-btn ${isSpeechEnabled ? 'active' : ''}`}
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              title={isSpeechEnabled ? "Mute Voice Response" : "Enable Voice Response"}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSpeechEnabled ? '#4b5563' : '#9ca3af' }}
            >
              {isSpeechEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>
        </header>

        <div className="messages-area" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role === "user" ? "user" : "bot"}`}>
              <div className={`avatar ${msg.role === "user" ? "user" : "bot"}`}>
                {msg.role === "user" ? <User size={20} /> : <Box size={20} />}
              </div>
              <div className="bubble-content">
                {msg.role === "model" ? (
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.parts[0].text
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <div className="avatar bot"><Box size={20} /></div>
              <div className="bubble-content">
                <div className="dots">
                  <div className="dot-anim"></div>
                  <div className="dot-anim"></div>
                  <div className="dot-anim"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="composer-area">
          <div className={`input-wrapper ${isListening ? 'listening-pulse' : ''}`}>
            <button
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title="Voice Input"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginRight: '8px', color: isListening ? '#ef4444' : '#6b7280', display: 'flex', alignItems: 'center' }}
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            <input
              type="text"
              className="chat-input"
              placeholder={isListening ? "Listening..." : "Ask me anything... (e.g., 'Show me TVs')"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
            />

            <button className="send-btn" onClick={() => handleSend()} disabled={loading || (!input.trim() && !isListening)}>
              <Send size={24} />
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        .listening-pulse {
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2) !important;
          border-color: #ef4444 !important;
        }
        .voice-btn:hover {
          color: #374151 !important;
        }
        .voice-btn.listening {
          animation: pulse 1.5s infinite;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }
        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: slideIn 0.2s ease-out;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 12px;
        }
        .modal-header h3 { margin: 0; font-size: 18px; display: flex; align-items: center; gap: 8px; color: #111827; }
        .close-btn { background: none; border: none; cursor: pointer; color: #6b7280; transition: color 0.2s; }
        .close-btn:hover { color: #111827; }

        .cmd-group { margin-bottom: 16px; }
        .cmd-group h4 { margin: 0 0 8px 0; color: #4b5563; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .cmd-group p { margin: 6px 0; color: #374151; font-size: 15px; background: #f9fafb; padding: 8px 12px; border-radius: 8px; border: 1px solid #e5e7eb; }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
