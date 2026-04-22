'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPageContent() {
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
            <h1 className="hero-title">About ElectroMinds</h1>
            <p className="hero-subtitle">
              Revolutionizing e-commerce with AI-powered shopping
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="section">
          <div className="section-content">
            <div className="grid grid-2" style={{ gap: 'var(--spacing-8)', alignItems: 'center' }}>
              {/* Left Side */}
              <div>
                <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-4)' }}>
                  Our Story
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--spacing-4)' }}>
                  ElectroMinds was founded with a mission to revolutionize how people shop online. We believe technology should enhance the shopping experience, not complicate it.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--spacing-4)' }}>
                  Our team of passionate developers and designers worked to create a platform that combines cutting-edge AI technology with user-friendly design.
                </p>
              </div>

              {/* Right Side - Stats */}
              <div className="grid grid-2" style={{ gap: 'var(--spacing-4)' }}>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                  <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-2)' }}>
                    500K+
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Active Users</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                  <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    10K+
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Products</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                  <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)', marginBottom: 'var(--spacing-2)' }}>
                    98%
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Satisfaction</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                  <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)', marginBottom: 'var(--spacing-2)' }}>
                    24/7
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="section-content">
            <h2 className="section-title">Our Values</h2>

            <div className="grid grid-3" style={{ marginTop: 'var(--spacing-8)' }}>
              {/* Value 1 */}
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-3)' }}>🎯</div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-2)' }}>
                  Innovation
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  We constantly innovate to stay ahead of market trends.
                </p>
              </div>

              {/* Value 2 */}
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-3)' }}>💡</div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-2)' }}>
                  Reliability
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Your trust is our priority.
                </p>
              </div>

              {/* Value 3 */}
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-3)' }}>❤️</div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-2)' }}>
                  Customer Focus
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Every decision guided by customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
