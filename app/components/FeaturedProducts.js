'use client';

import ProductGrid from './ProductGrid';

/**
 * FeaturedProducts Component
 * 
 * Section displaying featured products with title and subtitle.
 * 
 * Props:
 *   - title: Section title
 *   - subtitle: Section subtitle
 *   - products: Array of featured products
 *   - columns: Number of columns (default: 4, 2 on tablet, 1 on mobile)
 *   - onAddCart: Callback for add to cart
 *   - onWishlist: Callback for wishlist
 */

export default function FeaturedProducts({
  title = 'Featured Products',
  subtitle = 'Handpicked selection of our best sellers',
  products = [],
  columns = 4,
  onAddCart = () => {},
  onWishlist = () => {},
}) {
  return (
    <section className="section">
      <div className="section-content">
        {/* Header */}
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          columns={columns}
          onAddCart={onAddCart}
          onWishlist={onWishlist}
        />
      </div>
    </section>
  );
}
