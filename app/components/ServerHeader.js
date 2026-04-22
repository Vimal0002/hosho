'use client';

import React, { useState } from "react";
import { Menu, X, ShoppingCart, Search, Home } from "lucide-react";
import Link from "next/link";

export default function ServerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="/" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link href="/gallery" className="nav-link">
            <ShoppingCart size={18} />
            <span>Gallery</span>
          </Link>
          <a href="#products" className="nav-link">
            <Search size={18} />
            <span>Search</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Shopping Cart */}
          <button className="header-btn" title="Shopping Cart">
            <ShoppingCart size={20} />
            <span className="cart-badge">0</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="header-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="mobile-menu">
          <Link href="/" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link href="/gallery" className="nav-link">
            <ShoppingCart size={18} />
            <span>Gallery</span>
          </Link>
          <a href="#products" className="nav-link">
            <Search size={18} />
            <span>Search</span>
          </a>
        </nav>
      )}
    </header>
  );
}
