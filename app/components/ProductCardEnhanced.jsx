'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HoverScale } from './MagicUIWrapper';

/**
 * ProductCardEnhanced - Enhanced version with Magic UI animations
 * 
 * Features:
 * - Smooth hover animations
 * - Image zoom on hover
 * - Staggered card entrance
 * - Animated button interactions
 * - Wishlist heart animation
 */

export default function ProductCardEnhanced({
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
  delay = 0,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, amount: 0.3 }}
      className="product-card-enhanced"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="card-wrapper"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          cursor: 'pointer',
        }}
      >
        {/* Product Image Container */}
        <div className="product-image-container" style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
          <motion.img
            src={image}
            alt={name}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
            className="product-badge"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(124, 58, 237, 0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
            }}
          >
            {badge || 'Popular'}
          </motion.div>

          {/* Discount Badge */}
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.3 }}
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'linear-gradient(135deg, #ff4757, #ff6348)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '700',
              }}
            >
              -{discount}%
            </motion.div>
          )}
        </div>

        {/* Product Content */}
        <motion.div
          className="product-content"
          style={{ padding: '16px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
        >
          {/* Name */}
          <motion.h3
            className="product-name"
            style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </motion.h3>

          {/* Description */}
          <p
            className="product-description"
            style={{
              margin: '0 0 8px 0',
              fontSize: '13px',
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {description}
          </p>

          {/* Rating */}
          <motion.div
            className="product-rating"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px',
              fontSize: '13px',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            <span style={{ color: '#ffc107' }}>★★★★★</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              {rating}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              ({reviews})
            </span>
          </motion.div>

          {/* Price */}
          <motion.div
            className="product-price"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: delay + 0.25 }}
          >
            <span
              className="product-price-current"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ${numPrice.toFixed(2)}
            </span>
            {numOriginalPrice && (
              <span
                className="product-price-original"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                }}
              >
                ${numOriginalPrice.toFixed(2)}
              </span>
            )}
          </motion.div>

          {/* Actions */}
          <div
            className="product-actions"
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddCart}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <ShoppingCart size={16} />
              <span>{isLoading ? 'Adding...' : 'Add'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleWishlist}
              style={{
                width: '40px',
                height: '40px',
                padding: 0,
                background: isWishlisted 
                  ? 'linear-gradient(135deg, #ff4757, #ff6348)'
                  : 'rgba(255, 71, 87, 0.1)',
                color: isWishlisted ? 'white' : '#ff4757',
                border: isWishlisted ? 'none' : '1.5px solid #ff4757',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <motion.div
                animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .product-card-enhanced {
          width: 100%;
        }

        .card-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
        }

        .card-wrapper:hover {
          box-shadow: 0 12px 24px rgba(124, 58, 237, 0.15);
        }

        @media (max-width: 768px) {
          .product-image-container {
            height: 180px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
