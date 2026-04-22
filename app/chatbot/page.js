'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import styles from './ChatBotPage.module.css';

const VOICE_AVAILABLE = typeof window !== 'undefined' && (
  window.SpeechRecognition || window.webkitSpeechRecognition
);

export default function ChatBotPage() {
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! 👋 I'm your AI Order Assistant. How can I help you find the perfect electronics today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const [suggestions, setSuggestions] = useState([
    "Show me laptops",
    "What's the best smartphone?",
    "Help me place an order",
    "Track my order"
  ]);

  // Initialize speech recognition
  useEffect(() => {
    if (VOICE_AVAILABLE) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInput(prev => prev + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = () => {
    if (!VOICE_AVAILABLE) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleVoiceOutput = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        text: data.reply || "Sorry, I couldn't process that. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>🤖 AI Order Assistant</h1>
          <p>Your dedicated shopping companion</p>
          {isLoggedIn && (
            <p className={styles.userGreeting}>Welcome, {user?.name}! 👋</p>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h3>💡 Quick Tips</h3>
          <div className={styles.tips}>
            <div className={styles.tip}>
              <strong>🎤 Voice Input</strong>
              <p>Click the microphone button to use voice commands</p>
            </div>
            <div className={styles.tip}>
              <strong>🔊 Voice Output</strong>
              <p>Click speaker icon on any message to hear it read aloud</p>
            </div>
            <div className={styles.tip}>
              <strong>💬 Chat History</strong>
              <p>Your entire conversation history is remembered</p>
            </div>
            <div className={styles.tip}>
              <strong>🛍️ Shopping Help</strong>
              <p>Ask for product recommendations and order help</p>
            </div>
          </div>
        </aside>

        {/* Chat Section */}
        <div className={styles.chatSection}>
          {/* Messages Container */}
          <div className={styles.messagesContainer}>
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${styles[message.sender]}`}
              >
                <div className={styles.message}>
                  <div className={styles.messageBubble}>
                    {message.text}
                  </div>
                  {message.sender === 'bot' && (
                    <button
                      className={styles.voiceButton}
                      onClick={() => handleVoiceOutput(message.text)}
                      title={isSpeaking && idx === messages.length - 1 ? 'Stop' : 'Read aloud'}
                    >
                      {isSpeaking && idx === messages.length - 1 ? '🔊' : '🔉'}
                    </button>
                  )}
                </div>
                <span className={styles.timestamp}>
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.bot}`}>
                <div className={styles.message}>
                  <div className={styles.messageBubble}>
                    <span className={styles.typing}>
                      <span></span><span></span><span></span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className={styles.suggestions}>
              <p>Or try one of these:</p>
              <div className={styles.suggestionGrid}>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className={styles.suggestionButton}
                    onClick={() => handleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className={styles.inputForm}>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "🎤 Listening..." : "Type your message or use voice..."}
                className={styles.input}
                disabled={isLoading}
                maxLength={500}
              />

              {VOICE_AVAILABLE && (
                <button
                  type="button"
                  className={`${styles.iconButton} ${isListening ? styles.active : ''}`}
                  onClick={handleVoiceInput}
                  title={isListening ? "Stop listening" : "Start listening"}
                  disabled={isLoading}
                >
                  {isListening ? '🎤' : '🎙️'}
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={styles.sendButton}
                title="Send message"
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
          </form>

          {/* Info Footer */}
          <div className={styles.chatFooter}>
            <p>🛡️ Your data is secure | 💬 24/7 AI Support | ✨ Powered by Google Gemini</p>
          </div>
        </div>
      </div>
    </div>
  );
}
