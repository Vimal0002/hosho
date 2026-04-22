"use client";

import React from "react";
import { Heart, Github, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Main Footer */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <div className="brand-icon">⚡</div>
              <div className="brand-text">
                <h3>ElectroMinds</h3>
                <p>AI-Powered Electronics Assistant</p>
              </div>
            </div>
            <p className="brand-description">
              Your intelligent shopping companion for all electronics needs. 
              Powered by Google Gemini AI.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/gallery">Gallery</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>info@electrominds.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="footer-section">
            <h4>Credentials</h4>
            <div className="credentials-list">
              <div className="credential-item">
                <span className="credential-label">Built with</span>
                <span className="credential-value">Next.js 16</span>
              </div>
              <div className="credential-item">
                <span className="credential-label">AI Powered by</span>
                <span className="credential-value">Google Gemini</span>
              </div>
              <div className="credential-item">
                <span className="credential-label">Database</span>
                <span className="credential-value">SQLite</span>
              </div>
              <div className="credential-item">
                <span className="credential-label">Hosted on</span>
                <span className="credential-value">Vercel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; 2026 ElectroMinds. All rights reserved.</p>
          </div>
          <div className="footer-bottom-center">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-bottom-right">
            <a href="#github" className="social-link" title="GitHub">
              <Github size={20} />
            </a>
            <a href="#twitter" className="social-link" title="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" strokeWidth="2" stroke="currentColor" fill="none"/>
              </svg>
            </a>
            <a href="#linkedin" className="social-link" title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-container {
          background: var(--bg-sidebar);
          border-top: 1px solid var(--border-color);
          margin-top: 80px;
          padding-top: 60px;
          padding-bottom: 20px;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-main {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h4 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .brand-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .brand-text h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-light);
          margin: 0;
        }

        .brand-text p {
          font-size: 12px;
          color: var(--text-muted);
          margin: 4px 0 0 0;
        }

        .brand-description {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-top: 12px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 14px;
          transition: color var(--transition-fast);
        }

        .footer-links a:hover {
          color: var(--primary-light);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .contact-item svg {
          color: var(--primary-light);
          flex-shrink: 0;
        }

        .credentials-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: rgba(124, 58, 237, 0.05);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--primary-color);
        }

        .credential-label {
          font-size: 13px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          font-weight: 600;
        }

        .credential-value {
          font-size: 13px;
          color: var(--primary-light);
          font-weight: 700;
        }

        .footer-bottom {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          align-items: center;
        }

        .footer-bottom-left,
        .footer-bottom-right {
          font-size: 13px;
          color: var(--text-muted);
        }

        .footer-bottom-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-bottom-center a {
          font-size: 13px;
          color: var(--text-muted);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .footer-bottom-center a:hover {
          color: var(--primary-light);
        }

        .separator {
          color: var(--border-color);
        }

        .footer-bottom-right {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
        }

        .social-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .social-link:hover {
          background: rgba(124, 58, 237, 0.2);
          border-color: var(--primary-color);
          color: var(--primary-light);
        }

        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .footer-bottom {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .footer-bottom-right {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
