'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Zap, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../home.css';

export default function Gallery() {
  const { cartItems, addToCart } = useCart();
  const [products] = useState([
    { id: 1, name: "Aria Pro Wireless Headphones", category: "Audio", price: "$299.99", rating: 4.8, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { id: 2, name: "Lumina Smart Watch Series X", category: "Wearables", price: "$199.99", rating: 4.5, img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80" },
    { id: 3, name: "Nexus 4K Cinematic Drone", category: "Drones", price: "$899.99", rating: 4.9, img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80" },
    { id: 4, name: "CyberDeck Mechanical Keyboard", category: "Accessories", price: "$149.99", rating: 4.7, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
    { id: 5, name: "Aura Home Smart Speaker", category: "Smart Home", price: "$129.99", rating: 4.6, img: "https://images.unsplash.com/photo-1589003071515-2ab1bd4ddecb?w=500&q=80" },
    { id: 6, name: "Zenith Ultra HD Monitor", category: "Monitors", price: "$499.99", rating: 4.8, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?w=500&q=80" },
  ]);

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="nav-logo">
            <Zap className="nav-logo-icon" size={24} />
            <span>ElectroMinds</span>
          </Link>
          <div className="nav-actions">
            <Link href="/cart" className="icon-btn">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </Link>
            <Link href="/" className="btn-login">Back to Home</Link>
          </div>
        </div>
      </nav>

      <div className="gallery-section" style={{ padding: '60px 0' }}>
        <div className="container">
          <header className="cart-header">
            <Link href="/" className="back-link">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <h1>Product Gallery</h1>
            <p style={{ color: 'var(--text-muted)' }}>Explore our complete collection of futuristic gadgets</p>
          </header>

          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.img} alt={product.name} />
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
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
        </div>
      </div>
    </div>
  );
}

