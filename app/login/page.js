"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, Lock, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import '../home.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add real authentication logic here
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link href="/" className="login-logo">
              <Zap className="nav-logo-icon" size={32} />
              <span>ElectroMinds</span>
            </Link>
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Enter your details to access your account' : 'Join the future of electronics'}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn-login-submit">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="login-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn">
                <Chrome size={20} />
                <span>Google</span>
              </button>
              <button type="button" className="social-btn">
                <Github size={20} />
                <span>GitHub</span>
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-auth-mode"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="login-visual">
        <div className="visual-content">
          <h1>Experience Tech Like Never Before</h1>
          <p>Join thousands of users who trust ElectroMinds for their premium electronics needs.</p>
        </div>
        <div className="visual-glow" />
      </div>
    </div>
  );
}
