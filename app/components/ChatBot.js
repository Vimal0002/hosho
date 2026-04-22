'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Listen for anchor links or custom events to open the chat
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#chatbot') {
        setIsOpen(true);
      }
    };

    const handleOpenChat = () => setIsOpen(true);

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('open-chatbot', handleOpenChat);
    
    // Check initial hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('open-chatbot', handleOpenChat);
    };
  }, []);

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

  const handleQuickAction = (action) => {
    const messages_map = {
      'products': 'Show me the latest electronics',
      'recommendation': 'Can you recommend products for me?',
      'order': 'I want to place an order',
      'support': 'I need technical support'
    };
    
    setInput(messages_map[action] || '');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
        title="AI Order Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <h3>🤖 AI Order Assistant</h3>
              <p>ElectroMinds Shopping Helper</p>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.sender]}`}
              >
                <div className={styles.messageBubble}>
                  {message.text}
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
              <div className={`${styles.message} ${styles.bot}`}>
                <div className={styles.messageBubble}>
                  <span className={styles.typing}>
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions - Show only when no messages or limited messages */}
          {messages.length <= 1 && (
            <div className={styles.quickActions}>
              <button onClick={() => handleQuickAction('products')}>
                📦 Browse Products
              </button>
              <button onClick={() => handleQuickAction('recommendation')}>
                ✨ Get Recommendations
              </button>
              <button onClick={() => handleQuickAction('order')}>
                🛒 Place Order
              </button>
              <button onClick={() => handleQuickAction('support')}>
                🆘 Get Support
              </button>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className={styles.inputForm}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.input}
              disabled={isLoading}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={styles.sendButton}
              aria-label="Send message"
            >
              {isLoading ? '...' : '➤'}
            </button>
          </form>

          {/* Footer Info */}
          <div className={styles.chatFooter}>
            <p>💡 Ask about products, orders, tracking, returns, and more!</p>
          </div>
        </div>
      )}
    </>
  );
}
