import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [userId] = useState(1); // Demo user ID
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId: userId
        })
      });

      const data = await response.json();
      
      // Add assistant message to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          productId: product.id,
          quantity: 1
        })
      });

      if (response.ok) {
        setCart(prev => [...prev, { ...product, quantity: 1 }]);
        alert(`${product.name} added to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="chat-section">
          <div className="chat-header">
            <h1>💬 Electronics AI Chatbot</h1>
            <p>Ask me about products, prices, and recommendations!</p>
          </div>

          <div className="messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <h2>Welcome! 👋</h2>
                <p>I'm your AI electronics assistant. I can help you:</p>
                <ul>
                  <li>🔍 Search for electronics products</li>
                  <li>💡 Get personalized recommendations</li>
                  <li>🛒 Add items to your cart</li>
                  <li>💳 Place orders</li>
                </ul>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.role === 'user' ? '👤' : '🤖'} {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="message-content">
                  <span className="typing-indicator">
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? '⏳' : '➤'}
            </button>
          </form>
        </div>

        <div className="sidebar">
          <div className="products-section">
            <h2>📦 Featured Products</h2>
            <div className="products-list">
              {products.slice(0, 5).map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">${product.price}</div>
                  <div className="product-category">{product.category}</div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-section">
            <h2>🛒 Cart ({cart.length})</h2>
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <div className="cart-items">
                {cart.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
                <div className="cart-total">
                  Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
