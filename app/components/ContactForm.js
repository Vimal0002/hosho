'use client';

import { useState } from 'react';

/**
 * ContactForm Component
 * 
 * Form for contact inquiries with validation.
 * 
 * Props:
 *   - onSubmit: Callback when form is submitted
 */

export default function ContactForm({ onSubmit = () => {} }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {submitted && (
        <div
          className="form-success"
          style={{
            backgroundColor: 'var(--color-success)',
            color: 'white',
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          ✓ Thank you! We'll get back to you soon.
        </div>
      )}

      {/* Name Field */}
      <div className="form-group">
        <label htmlFor="name" className="form-label required">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          placeholder="Your name"
          required
        />
      </div>

      {/* Email Field */}
      <div className="form-group">
        <label htmlFor="email" className="form-label required">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          placeholder="your@email.com"
          required
        />
      </div>

      {/* Subject Field */}
      <div className="form-group">
        <label htmlFor="subject" className="form-label required">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="form-input"
          placeholder="What is this about?"
          required
        />
      </div>

      {/* Message Field */}
      <div className="form-group">
        <label htmlFor="message" className="form-label required">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Your message..."
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isLoading}
        style={{ width: '100%', minHeight: '44px' }}
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
