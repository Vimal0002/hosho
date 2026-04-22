'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    login(formData.email, formData.email.split('@')[0]);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowModal(false);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    login(formData.email, formData.name);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowModal(false);
  };

  return (
    <>
      {/* Auth Button */}
      <button 
        className={styles.authButton}
        onClick={() => {
          setShowModal(true);
          setIsLoginForm(true);
          setError('');
        }}
        title={isLoggedIn ? `Logged in as ${user?.name}` : 'Login or Sign Up'}
      >
        {isLoggedIn ? (
          <>
            <span className={styles.userIcon}>👤</span>
            <span className={styles.userName}>{user?.name}</span>
          </>
        ) : (
          <>
            <span className={styles.loginIcon}>🔐</span>
            <span>Login</span>
          </>
        )}
      </button>

      {/* Auth Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {isLoggedIn ? (
              // User Profile
              <div className={styles.profileSection}>
                <h2>👤 My Profile</h2>
                <div className={styles.userInfo}>
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Login Time:</strong> {new Date(user?.loginTime).toLocaleString()}</p>
                </div>
                <button 
                  className={`${styles.button} ${styles.danger}`}
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>
            ) : (
              // Login/Signup Form
              <>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>

                {/* Tabs */}
                <div className={styles.tabs}>
                  <button
                    className={`${styles.tab} ${isLoginForm ? styles.active : ''}`}
                    onClick={() => {
                      setIsLoginForm(true);
                      setError('');
                      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    }}
                  >
                    🔐 Login
                  </button>
                  <button
                    className={`${styles.tab} ${!isLoginForm ? styles.active : ''}`}
                    onClick={() => {
                      setIsLoginForm(false);
                      setError('');
                      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    }}
                  >
                    ✍️ Sign Up
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={isLoginForm ? handleLogin : handleSignup} className={styles.form}>
                  <h2>{isLoginForm ? '🔐 Login to ElectroMinds' : '✍️ Create Your Account'}</h2>

                  {error && <div className={styles.error}>{error}</div>}

                  {!isLoginForm && (
                    <div className={styles.formGroup}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required={!isLoginForm}
                      />
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {!isLoginForm && (
                    <div className={styles.formGroup}>
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required={!isLoginForm}
                      />
                    </div>
                  )}

                  <button type="submit" className={`${styles.button} ${styles.primary}`}>
                    {isLoginForm ? '🔐 Login' : '✍️ Sign Up'}
                  </button>

                  <p className={styles.terms}>
                    {isLoginForm ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      type="button"
                      onClick={() => setIsLoginForm(!isLoginForm)}
                      className={styles.link}
                    >
                      {isLoginForm ? 'Sign Up' : 'Login'}
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
