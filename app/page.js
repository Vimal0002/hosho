
"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Zap, ShoppingBag, Truck, RotateCcw, Box, User, Terminal, History, MessageSquare, AlertCircle, Sparkles } from "lucide-react";

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
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: data.parts[0].text }] }]);
      } else {
        const errorText = data.parts?.[0]?.text || "Communication error. Please check your API Key or connection.";
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: `⚠️ **Error**: ${errorText}` }] }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: "Network error. Is the server running?" }] }]);
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
      {/* Main Chat Area - Full Screen Messenger Style */}
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

          <div className="header-actions">
            {/* Placeholder icons for the 'clean' look */}
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
          <div className="input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything... (e.g., 'Show me TVs' or 'Track Order')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
            />
            <button className="send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
              <Send size={24} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
