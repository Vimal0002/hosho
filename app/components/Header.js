"use client";

import React, { useState } from "react";
import { Menu, X, Moon, Sun, ShoppingCart, Search, Home } from "lucide-react";
import { useTheme } from "../providers";
import AuthModal from "./AuthModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">ElectroMinds</span>
        </div>

        {/* Navigation - Desktop */}
        <nav className="header-nav desktop-only">
          <a href="/" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </a>
          <a href="/gallery" className="nav-link">
            <ShoppingCart size={18} />
            <span>Gallery</span>
          </a>
          <a href="/chatbot" className="nav-link">
            <span>🤖</span>
            <span>ChatBot</span>
          </a>
          <a href="#products" className="nav-link">
            <Search size={18} />
            <span>Search</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="header-btn"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Shopping Cart */}
          <button className="header-btn" title="Shopping Cart">
            <ShoppingCart size={20} />
            <span className="cart-badge">0</span>
          </button>

          {/* Auth Modal */}
          <div className="header-auth">
            <AuthModal />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="header-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="header-mobile-nav">
          <a href="/" className="mobile-nav-link">
            <Home size={18} />
            <span>Home</span>
          </a>
          <a href="/gallery" className="mobile-nav-link">
            <ShoppingCart size={18} />
            <span>Gallery</span>
          </a>
          <a href="/chatbot" className="mobile-nav-link">
            <span>🤖</span>
            <span>ChatBot</span>
          </a>
          <a href="#products" className="mobile-nav-link">
            <Search size={18} />
            <span>Search</span>
          </a>
        </nav>
      )}

      <style jsx>{`
        .header-wrapper {
          background: var(--header-gradient);
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(20px);
          sticky: top 0;
          z-index: 50;
          position: sticky;
          top: 0;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          gap: 20px;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .logo-icon {
          font-size: 28px;
          display: flex;
          align-items: center;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-nav {
          display: flex;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          background: rgba(124, 58, 237, 0.1);
          color: var(--primary-light);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .header-auth {
          display: flex;
          align-items: center;
        }

        .header-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
        }

        .header-btn:hover {
          background: rgba(124, 58, 237, 0.15);
          border-color: var(--primary-color);
          color: var(--primary-light);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--danger);
          color: white;
          font-size: 10px;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-app);
        }

        .header-mobile-nav {
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid var(--border-color);
          padding: 12px;
          gap: 8px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .mobile-nav-link:hover {
          background: rgba(124, 58, 237, 0.1);
          color: var(--primary-light);
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: flex;
          }

          .header-container {
            padding: 0 16px;
          }

          .logo-text {
            display: none;
          }

          .header-auth {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
