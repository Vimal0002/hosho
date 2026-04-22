'use client';

import ProductCard from './ProductCard';

/**
 * ProductGrid Component
 * 
 * Displays multiple products in a responsive grid.
 * Auto-adjusts columns based on screen size.
 * 
 * Props:
 *   - products: Array of product objects
 *   - columns: Number of columns on desktop (default: 4)
 *   - onAddCart: Callback for add to cart
 *   - onWishlist: Callback for wishlist
 */

export default function ProductGrid({
  products = [],
  columns = 4,
  onAddCart = () => {},
  onWishlist = () => {},
}) {
  if (!products || products.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-12) var(--spacing-4)',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
          No products available
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-${columns}`}
      style={{
        '--cols': columns,
      }}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id || index}
          image={product.image}
          name={product.name}
          description={product.description}
          price={product.price}
          originalPrice={product.originalPrice}
          rating={product.rating || 4.5}
          reviews={product.reviews || 0}
          badge={product.badge}
          onAddCart={() => onAddCart(product)}
          onWishlist={() => onWishlist(product)}
        />
      ))}
    </div>
  );
}
