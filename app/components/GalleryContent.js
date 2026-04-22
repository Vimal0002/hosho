'use client';

import ServerHeader from './ServerHeader';
import Footer from './Footer';
import ProductGalleryNew from './ProductGalleryNew';

export default function GalleryContent() {
  return (
    <>
      <ServerHeader />
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        {/* Gallery Hero */}
        <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', textAlign: 'center', paddingBottom: 'var(--spacing-8)' }}>
          <div className="section-content">
            <h1 className="section-title">Product Gallery</h1>
            <p className="section-subtitle">
              Browse our complete collection of electronics and accessories
            </p>
          </div>
        </section>

        {/* Gallery Component */}
        <ProductGalleryNew />
      </main>
      <Footer />
    </>
  );
}
