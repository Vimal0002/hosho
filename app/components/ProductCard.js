'use client';

import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

/**
 * ProductCard Component
 * 
 * Displays a single product with image, name, price, rating, and actions.
 * Fully responsive and interactive.
 * 
 * Props:
 *   - image: Product image URL
 *   - name: Product name
 *   - description: Short description
 *   - price: Current price
 *   - originalPrice: Original price (optional, for showing discount)
 *   - rating: Product rating (0-5)
 *   - reviews: Number of reviews
 *   - badge: Badge text (e.g., "Sale", "New")
 *   - onAddCart: Callback when add to cart is clicked
 *   - onWishlist: Callback when wishlist is clicked
 */

export default function ProductCard({
  image = 'https://via.placeholder.com/300x300',
  name = 'Product Name',
  description = 'Product description',
  price = 99.99,
  originalPrice = null,
  rating = 4.5,
  reviews = 128,
  badge = null,
  onAddCart = () => {},
  onWishlist = () => {},
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCart = async () => {
    setIsLoading(true);
    await onAddCart();
    setIsLoading(false);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onWishlist?.(!isWishlisted);
  };

  const numPrice = typeof price === 'string' ? parseFloat(price.replace('$', '')) : parseFloat(price);
  const numOriginalPrice = originalPrice 
    ? (typeof originalPrice === 'string' ? parseFloat(originalPrice.replace('$', '')) : parseFloat(originalPrice))
    : null;

  const discount = numOriginalPrice
    ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {/* Product Image */}
      <div className="product-image">
        <img src={image} alt={name} />
        
        {/* Badge */}
        {badge && (
          <div className="product-badge">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div
            className="product-badge"
            style={{
              top: 'auto',
              right: 'auto',
              bottom: 'var(--spacing-3)',
              left: 'var(--spacing-3)',
              backgroundColor: 'var(--color-error)',
            }}
          >
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="product-content">
        <h3 className="product-name">{name}</h3>
        
        <p className="product-description">{description}</p>

        {/* Rating */}
        <div className="product-rating">
          <span className="stars">★★★★★</span>
          <span>{rating}</span>
          <span>({reviews})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="product-price-current">${numPrice.toFixed(2)}</span>
          {numOriginalPrice && (
            <span className="product-price-original">
              ${numOriginalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="product-actions">
          <button
            className="btn btn-primary"
            onClick={handleAddCart}
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            <ShoppingCart size={18} />
            {isLoading ? 'Adding...' : 'Add'}
          </button>

          <button
            className="btn btn-outline"
            onClick={handleWishlist}
            style={{
              flex: '0 0 auto',
              padding: 'var(--spacing-2) var(--spacing-3)',
              backgroundColor: isWishlisted
                ? 'var(--color-error)'
                : 'transparent',
              borderColor: 'var(--color-primary)',
              color: isWishlisted ? 'white' : 'var(--color-primary)',
            }}
          >
            <Heart
              size={18}
              fill={isWishlisted ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
