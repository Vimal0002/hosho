"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ShoppingCart, 
  Moon, 
  Sun, 
  Menu, 
  Star, 
  Truck, 
  Headphones, 
  Tag, 
  Instagram, 
  Twitter, 
  Facebook,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './home.css';
import ChatBot from './components/ChatBot';
import { useCart } from './context/CartContext';

export default function ElectroMindsLanding() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems, addToCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize dark mode based on local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', newTheme);
  };

  // Mock Data
  const products = [
    { id: 1, name: "Aria Pro Wireless Headphones", category: "Audio", badge: "Best Seller", price: "$299.99", rating: 4.8, description: "Active noise cancelling with 30hr battery.", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { id: 2, name: "Lumina Smart Watch Series X", category: "Wearables", badge: "New", price: "$199.99", rating: 4.5, description: "Track your health and stay connected daily.", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80" },
    { id: 3, name: "Nexus 4K Cinematic Drone", category: "Drones", badge: "-15%", price: "$899.99", rating: 4.9, description: "Capture breathtaking aerial ultra-HD footage.", img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80" },
    { id: 4, name: "CyberDeck Mechanical Keyboard", category: "Accessories", badge: "", price: "$149.99", rating: 4.7, description: "Tactile switches with customizable RGB lighting.", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
    { id: 5, name: "Aura Home Smart Speaker", category: "Smart Home", badge: "Trending", price: "$129.99", rating: 4.6, description: "Voice-controlled high fidelity wireless speaker.", img: "https://images.unsplash.com/photo-1589003071515-2ab1bd4ddecb?w=500&q=80" },
    { id: 6, name: "Zenith Ultra HD Monitor", category: "Monitors", badge: "", price: "$499.99", rating: 4.8, description: "32-inch 4K IPS display for creators and gamers.", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?w=500&q=80" },
    { id: 7, name: "Quantum Pro Mirrorless Camera", category: "Cameras", badge: "Pro", price: "$1299.99", rating: 5.0, description: "Professional grade photography redefined.", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80" },
    { id: 8, name: "Nova Portable Power Station", category: "Accessories", badge: "", price: "$249.99", rating: 4.4, description: "Keep your devices charged wherever you go.", img: "https://images.unsplash.com/photo-1605651571420-91191ec4668b?w=500&q=80" },
    { id: 9, name: "Vortex Gaming Mouse", category: "Gaming", badge: "Gamer Choice", price: "$89.99", rating: 4.7, description: "Ultra-lightweight with precision 25K DPI sensor.", img: "https://images.unsplash.com/photo-1527814050087-3793815479ea?w=500&q=80" },
    { id: 10, name: "Echo Vision VR Headset", category: "VR & AR", badge: "-20%", price: "$349.99", rating: 4.3, description: "Immersive standalone virtual reality experience.", img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1cb?w=500&q=80" },
    { id: 11, name: "Aegis Secure Router", category: "Networking", badge: "Essential", price: "$179.99", rating: 4.6, description: "Next-gen Wi-Fi 6 router with built-in firewall shield.", img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80" },
    { id: 12, name: "Titan 5TB External SSD", category: "Storage", badge: "", price: "$299.99", rating: 4.9, description: "Lightning-fast portable storage for massive files.", img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&q=80" },
    { id: 13, name: "Nebula Smart RGB Bulb", category: "Smart Home", badge: "New", price: "$29.99", rating: 4.5, description: "16 million colors voice-controlled lighting.", img: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&q=80" },
    { id: 14, name: "Apollo Fitness Tracker", category: "Wearables", badge: "-10%", price: "$99.99", rating: 4.6, description: "Minimalist band tracking sleep and active heart rate.", img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=500&q=80" },
    { id: 15, name: "Stellar 100W GaN Charger", category: "Accessories", badge: "Essential", price: "$59.99", rating: 4.8, description: "Compact multi-port fast charger for all devices.", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80" },
    { id: 16, name: "Horizon Stream Cam", category: "Cameras", badge: "Pro", price: "$149.99", rating: 4.7, description: "1080p 60fps webcam for flawless streaming.", img: "https://images.unsplash.com/photo-1599525287739-166e4a316e6f?w=500&q=80" },
    { id: 17, name: "Zephyr Air Purifier Max", category: "Home Tech", badge: "", price: "$249.99", rating: 4.9, description: "Smart HEPA filter with real-time air quality tracking.", img: "https://images.unsplash.com/photo-1585868218174-a0352ff2bd13?w=500&q=80" },
    { id: 18, name: "Eclipse Noise-Isolating Earbuds", category: "Audio", badge: "Trending", price: "$179.99", rating: 4.7, description: "Compact truly wireless earbuds with deep bass.", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80" }
  ];

  const reviews = [
    { id: 1, name: "Alex Johnson", text: "Fast shipping and the quality of the drone is phenomenal! Highly recommend ElectroMinds.", rating: 5 },
    { id: 2, name: "Sarah Williams", text: "The AI recommendations helped me find the perfect headphones for my workouts.", rating: 5 },
    { id: 3, name: "Michael Chen", text: "Excellent customer service and unbeatable prices on smart home gadgets.", rating: 4 },
  ];

  return (
    <div className="landing-page">
      <ChatBot />
      {/* 1. NAVBAR */}
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="nav-logo">
            <Zap className="nav-logo-icon" size={24} />
            <span>ElectroMinds</span>
          </Link>

          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link href="/">Home</Link>
            <Link href="/chatbot">ChatBot</Link>
            <button onClick={() => setIsSearchOpen(true)} className="nav-search-link">Search</button>
          </div>

          <div className="nav-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Dark Mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link href="/cart" className="icon-btn" aria-label="View Cart">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </Link>
            <Link href="/login" className="btn-login">
              Login
            </Link>
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">AI-Powered Chat Support</h1>
            <p className="hero-subtitle">
              Get instant assistance from our intelligent chatbot. Ask anything about our services and get answers 24/7.
            </p>
            <Link 
              href="#chatbot" 
              className="btn btn-primary" 
              style={{ padding: '15px 30px', fontSize: '1.1rem' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
            >
              Start Chatting
            </Link>
          </div>
          <div className="hero-image">
            <img 
              src="/hero-devices.png" 
              alt="Premium electronics devices" 
            />
          </div>
        </div>
      </section>

      {/* 3. FEATURES STRIP */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3 className="feature-title">Great Deals</h3>
              <p className="feature-desc">Unbeatable prices on premium tech</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-desc">On all orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3 className="feature-title">Customer Reviews</h3>
              <p className="feature-desc">Trusted by 10k+ tech lovers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-desc">Always here when you need us</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 FEATURED PRODUCTS */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore Our Premium Tech</h2>
            <p style={{ color: 'var(--text-muted)' }}>Handpicked gadgets designed for the modern lifestyle</p>
          </div>
          
          <div className="products-scroll-container">
            <div className="products-grid" ref={scrollRef}>
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.img} alt={product.name} loading="lazy" />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">{product.price}</span>
                      <button 
                        className="btn-add-cart"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="scroll-btn left" onClick={scrollLeft} aria-label="Scroll Left">
              <ChevronLeft size={24} />
            </button>
            <button className="scroll-btn right" onClick={scrollRight} aria-label="Scroll Right">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. AI CHAT PROMO SECTION */}
      <section className="chatbox-section" id="chatbot" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Need Help? Chat with AI</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
              Our intelligent assistant is ready to help you find the best deals and track your orders.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ padding: '15px 40px', fontSize: '1.1rem' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
            >
              Open AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
                <div className="reviewer-name">— {review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER SIGNUP */}
      <section className="newsletter-section">
        <div className="container">
          <h2 className="newsletter-title">Join the ElectroMinds Family</h2>
          <p className="newsletter-desc">Subscribe to our newsletter for exclusive deals, early access to new products, and tech news.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" className="newsletter-input" required />
            <button type="submit" className="btn btn-subscribe">Subscribe</button>
          </form>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <Link href="/" className="nav-logo" style={{ marginBottom: '20px' }}>
                <Zap className="nav-logo-icon" size={24} />
                <span>ElectroMinds</span>
              </Link>
              <p style={{ color: 'var(--text-muted)' }}>
                Your ultimate AI-powered destination for the best electronics and gadgets seamlessly integrated to your daily lifestyle.
              </p>
              <div className="social-icons">
                <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/gallery">Shop All</Link>
                <Link href="/chatbot">AI ChatBot</Link>
                <Link href="#deals">Special Offers</Link>
              </div>
            </div>
            <div className="footer-col">
              <h4>Customer Care</h4>
              <div className="footer-links">
                <Link href="/contact">Contact Us</Link>
                <Link href="/shipping">Shipping Policy</Link>
                <Link href="/returns">Returns & Exchanges</Link>
                <Link href="/faq">FAQ</Link>
              </div>
            </div>
            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>Email: hello@electrominds.com</li>
                <li>Phone: 1-800-ELECTRO</li>
                <li>Address: 123 Tech Avenue, Silicon Valley, CA 94025</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} ElectroMinds. All rights reserved.
          </div>
        </div>
      </footer>
      {/* SEARCH MODAL */}
      {isSearchOpen && (
        <div className="search-modal">
          <div className="search-overlay" onClick={() => setIsSearchOpen(false)} />
          <div className="search-content">
            <input 
              type="text" 
              placeholder="Search products, brands, categories..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="search-close" onClick={() => setIsSearchOpen(false)}>✕</button>
            <div className="search-results">
              {searchQuery && (
                <div className="results-list">
                  {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                    <div key={p.id} className="search-result-item">
                      <img src={p.img} alt={p.name} />
                      <div>
                        <h4>{p.name}</h4>
                        <p>{p.price}</p>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="no-results">No products found for "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
