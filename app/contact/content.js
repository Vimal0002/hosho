'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPageContent() {
  const handleFormSubmit = async (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section
          className="hero"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            minHeight: '300px',
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">Get in Touch</h1>
            <p className="hero-subtitle">
              We'd love to hear from you. Send us a message!
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="section">
          <div className="section-content">
            <div className="grid grid-2" style={{ gap: 'var(--spacing-8)' }}>
              {/* Contact Form */}
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-6)' }}>
                  Send us a Message
                </h2>
                <ContactForm onSubmit={handleFormSubmit} />
              </div>

              {/* Contact Info */}
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-6)' }}>
                  Contact Information
                </h2>

                {/* Contact Details */}
                <div style={{ marginBottom: 'var(--spacing-8)' }}>
                  {/* Phone */}
                  <div
                    className="card"
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-4)',
                      marginBottom: 'var(--spacing-4)',
                      padding: 'var(--spacing-4)',
                    }}
                  >
                    <Phone
                      size={24}
                      style={{ color: 'var(--color-primary)', flexShrink: 0 }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 var(--spacing-1) 0', fontWeight: 'var(--font-bold)' }}>
                        Phone
                      </h4>
                      <a
                        href="tel:+15551234567"
                        style={{
                          margin: 0,
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                        }}
                      >
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div
                    className="card"
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-4)',
                      marginBottom: 'var(--spacing-4)',
                      padding: 'var(--spacing-4)',
                    }}
                  >
                    <Mail
                      size={24}
                      style={{ color: 'var(--color-secondary)', flexShrink: 0 }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 var(--spacing-1) 0', fontWeight: 'var(--font-bold)' }}>
                        Email
                      </h4>
                      <a
                        href="mailto:info@electrominds.com"
                        style={{
                          margin: 0,
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                        }}
                      >
                        info@electrominds.com
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div
                    className="card"
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-4)',
                      padding: 'var(--spacing-4)',
                    }}
                  >
                    <MapPin
                      size={24}
                      style={{ color: 'var(--color-accent)', flexShrink: 0 }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 var(--spacing-1) 0', fontWeight: 'var(--font-bold)' }}>
                        Location
                      </h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                        San Francisco, CA<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="card" style={{ padding: 'var(--spacing-6)' }}>
                  <h4 style={{ margin: '0 0 var(--spacing-4) 0', fontWeight: 'var(--font-bold)' }}>
                    Business Hours
                  </h4>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <p style={{ margin: 'var(--spacing-2) 0' }}>
                      <strong>Mon-Fri:</strong> 9AM-6PM PST
                    </p>
                    <p style={{ margin: 'var(--spacing-2) 0' }}>
                      <strong>Saturday:</strong> 10AM-4PM PST
                    </p>
                    <p style={{ margin: 'var(--spacing-2) 0' }}>
                      <strong>Sunday:</strong> Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
