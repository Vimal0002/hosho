'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ShoppingCart, Heart } from 'lucide-react';

export default function ProductGallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detect dark mode
    setIsDarkMode(document.documentElement.style.colorScheme === 'dark' || localStorage.getItem('theme') === 'dark');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % 3);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + 3) % 3);
  };

  const getImageUrl = (productId) => {
    return `https://via.placeholder.com/400x300?text=${productId}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '400px' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)' }}>Loading products...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Please wait while we fetch your products</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--bg-primary)' }}>
      {/* View Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-8)' }}>
        <div style={{ display: 'flex', gap: '10px', borderRadius: '8px', overflow: 'hidden' }}>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'grid' ? 'white' : 'var(--color-primary)',
              border: `2px solid ${viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-primary)'}`,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 200ms ease'
            }}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: viewMode === 'carousel' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'carousel' ? 'white' : 'var(--color-primary)',
              border: `2px solid ${viewMode === 'carousel' ? 'var(--color-primary)' : 'var(--color-primary)'}`,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 200ms ease'
            }}
            onClick={() => setViewMode('carousel')}
          >
            Carousel View
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => setSelectedProduct(product)}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 300ms ease',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '220px',
                backgroundColor: 'var(--bg-secondary)',
                overflow: 'hidden'
              }}>
                <img
                  src={getImageUrl(product.id)}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {product.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                  {product.category}
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    ₹{product.price}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                    ₹{product.mrp}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Stock: {product.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carousel View */}
      {viewMode === 'carousel' && products.length > 0 && (
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          {products.slice(0, 1).map((product) => (
            <div
              key={product.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                alignItems: 'center'
              }}
            >
              <div style={{
                height: '400px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-primary)'
              }}>
                <img
                  src={getImageUrl(product.id)}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div>
                <h2 style={{ fontSize: '28px', margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
                  {product.name}
                </h2>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '12px',
                  marginBottom: '15px'
                }}>
                  {product.category}
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '14px' }}>
                  <span>⭐ {product.rating || 4.5}</span>
                  <span>📦 {product.stock} in stock</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    ₹{product.price}
                  </span>
                  <span style={{ fontSize: '16px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                    ₹{product.mrp}
                  </span>
                  <span style={{
                    backgroundColor: 'var(--color-error)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Save ₹{product.mrp - product.price}
                  </span>
                </div>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}>
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedProduct(null)}>
          <div
            style={{
              borderRadius: '12px',
              maxWidth: '900px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-primary)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                zIndex: 10,
                fontSize: '24px'
              }}
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              padding: '30px'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={getImageUrl(selectedProduct.id)}
                  alt={selectedProduct.name}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '15px'
                }}>
                  <button style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }} onClick={prevImage}>
                    ←
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>
                    {imageIndex + 1} / 3
                  </span>
                  <button style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }} onClick={nextImage}>
                    →
                  </button>
                </div>
              </div>
              <div>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: 'var(--text-primary)' }}>
                  {selectedProduct.name}
                </h2>
                <p style={{ fontSize: '14px', marginBottom: '15px', color: 'var(--text-secondary)' }}>
                  {selectedProduct.category}
                </p>
                <div style={{ fontSize: '14px', marginBottom: '15px' }}>
                  ⭐ {selectedProduct.rating || 4.5} / 5
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    ₹{selectedProduct.price}
                  </span>
                  <span style={{ fontSize: '16px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                    ₹{selectedProduct.mrp}
                  </span>
                  <span style={{
                    backgroundColor: 'var(--color-error)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Save ₹{selectedProduct.mrp - selectedProduct.price}
                  </span>
                </div>
                <div style={{ marginBottom: '20px', fontWeight: 600 }}>
                  {selectedProduct.stock > 0
                    ? `✅ ${selectedProduct.stock} in stock`
                    : '❌ Out of stock'}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: `2px solid var(--color-primary)`,
                    color: 'var(--color-primary)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <Heart size={18} />
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
