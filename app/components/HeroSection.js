'use client';

/**
 * HeroSection Component
 * 
 * Large banner section with background, headline, subtitle, and CTA buttons.
 * Perfect for homepage banners.
 * 
 * Props:
 *   - backgroundImage: Background image URL
 *   - title: Main headline
 *   - subtitle: Secondary headline/description
 *   - ctaText: Primary CTA button text
 *   - ctaSecondary: Secondary CTA button text (optional)
 *   - onCTA: Callback for primary CTA button
 *   - onCTASecondary: Callback for secondary CTA button
 */

export default function HeroSection({
  backgroundImage = 'https://via.placeholder.com/1200x400',
  title = 'Welcome to ElectroMinds',
  subtitle = 'Discover amazing products powered by AI',
  ctaText = 'Shop Now',
  ctaSecondary = 'Learn More',
  onCTA = () => {},
  onCTASecondary = () => {},
}) {
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Pattern Overlay */}
      <div className="hero-background" />

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={onCTA}
            style={{
              backgroundColor: 'white',
              color: 'var(--color-primary)',
              borderColor: 'white',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
            }}
          >
            {ctaText}
          </button>

          <button
            className="btn btn-outline"
            onClick={onCTASecondary}
            style={{
              borderColor: 'white',
              color: 'white',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
            }}
          >
            {ctaSecondary}
          </button>
        </div>
      </div>
    </div>
  );
}
