"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ShoppingCart, Heart } from "lucide-react";
import { useTheme } from "../providers";

export default function ProductGallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      <div className={`gallery-container ${isDarkMode ? "dark" : "light"}`}>
        <div className="gallery-loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className={`gallery-container ${isDarkMode ? "dark" : "light"}`}>
      {/* View Mode Toggle */}
      <div className="gallery-controls">
        <div className="view-mode-toggle">
          <button
            className={`mode-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={`mode-btn ${viewMode === "carousel" ? "active" : ""}`}
            onClick={() => setViewMode("carousel")}
          >
            Carousel
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="gallery-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="product-image-wrapper">
                <img
                  src={getImageUrl(product.id)}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-overlay">
                  <button className="add-to-cart-btn">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button className="wishlist-btn">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <div className="price-section">
                  <span className="price">₹{product.price}</span>
                  <span className="mrp">₹{product.mrp}</span>
                </div>
                <div className="stock-info">
                  Stock: {product.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carousel View */}
      {viewMode === "carousel" && (
        <div className="gallery-carousel">
          {products.slice(0, 1).map((product) => (
            <div key={product.id} className="carousel-slide">
              <div className="carousel-image-container">
                <img
                  src={getImageUrl(product.id)}
                  alt={product.name}
                  className="carousel-image"
                />
              </div>
              <div className="carousel-info">
                <h2>{product.name}</h2>
                <p className="category-badge">{product.category}</p>
                <div className="rating-stock">
                  <span>⭐ {product.rating || 4.5}</span>
                  <span>📦 {product.stock} in stock</span>
                </div>
                <div className="carousel-pricing">
                  <span className="price">₹{product.price}</span>
                  <span className="mrp">₹{product.mrp}</span>
                </div>
                <button className="checkout-btn">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedProduct(null)}
            >
              <X size={24} />
            </button>
            <div className="modal-body">
              <div className="modal-image-section">
                <img
                  src={getImageUrl(selectedProduct.id)}
                  alt={selectedProduct.name}
                  className="modal-image"
                />
                <div className="image-nav">
                  <button className="nav-btn" onClick={prevImage}>
                    <ChevronLeft size={20} />
                  </button>
                  <span className="image-counter">
                    {imageIndex + 1} / 3
                  </span>
                  <button className="nav-btn" onClick={nextImage}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="modal-info-section">
                <h2>{selectedProduct.name}</h2>
                <p className="category">{selectedProduct.category}</p>
                <div className="rating">
                  ⭐ {selectedProduct.rating || 4.5} / 5
                </div>
                <div className="pricing-section">
                  <span className="price">₹{selectedProduct.price}</span>
                  <span className="mrp">₹{selectedProduct.mrp}</span>
                  <span className="discount">
                    Save ₹{selectedProduct.mrp - selectedProduct.price}
                  </span>
                </div>
                <div className="availability">
                  <span className="stock">
                    {selectedProduct.stock > 0
                      ? `✅ ${selectedProduct.stock} in stock`
                      : "❌ Out of stock"}
                  </span>
                </div>
                <div className="action-buttons">
                  <button className="btn-primary">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button className="btn-secondary">
                    <Heart size={18} />
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-container {
          padding: 20px;
          transition: background-color 0.3s;
          width: 100%;
        }

        .gallery-container.dark {
          background-color: #0f0f0f;
          color: #fff;
        }

        .gallery-container.light {
          background-color: #f5f5f5;
          color: #000;
        }

        .gallery-loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }

        .gallery-controls {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .view-mode-toggle {
          display: flex;
          gap: 10px;
          border-radius: 8px;
          overflow: hidden;
        }

        .mode-btn {
          padding: 10px 20px;
          background-color: transparent;
          border: 2px solid #7c3aed;
          color: #7c3aed;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .mode-btn.active {
          background-color: #7c3aed;
          color: white;
        }

        .mode-btn:hover {
          background-color: #7c3aed;
          color: white;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .product-card {
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
        }

        .product-image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .gallery-container.dark .product-image-wrapper {
          background-color: #1a1a1a;
        }

        .gallery-container.light .product-image-wrapper {
          background-color: #fff;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .add-to-cart-btn,
        .wishlist-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .add-to-cart-btn {
          background-color: #7c3aed;
          color: white;
        }

        .add-to-cart-btn:hover {
          background-color: #6d28d9;
        }

        .wishlist-btn {
          background-color: white;
          color: #ff3b30;
        }

        .wishlist-btn:hover {
          background-color: #f5f5f5;
        }

        .product-info {
          padding: 15px;
        }

        .gallery-container.dark .product-info {
          background-color: #1a1a1a;
        }

        .gallery-container.light .product-info {
          background-color: #fff;
        }

        .product-info h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .category {
          font-size: 12px;
          color: #888;
          margin: 0 0 10px 0;
        }

        .price-section {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;
        }

        .price {
          font-size: 18px;
          font-weight: 700;
          color: #7c3aed;
        }

        .mrp {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .stock-info {
          font-size: 12px;
          color: #666;
        }

        .gallery-carousel {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 12px;
        }

        .gallery-container.dark .gallery-carousel {
          background-color: #1a1a1a;
        }

        .gallery-container.light .gallery-carousel {
          background-color: #fff;
        }

        .carousel-slide {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: center;
        }

        .carousel-image-container {
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
        }

        .gallery-container.dark .carousel-image-container {
          background-color: #0f0f0f;
        }

        .gallery-container.light .carousel-image-container {
          background-color: #f5f5f5;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .carousel-info h2 {
          font-size: 28px;
          margin: 0 0 10px 0;
        }

        .category-badge {
          display: inline-block;
          padding: 6px 12px;
          background-color: #7c3aed;
          color: white;
          border-radius: 20px;
          font-size: 12px;
          margin-bottom: 15px;
        }

        .rating-stock {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          font-size: 14px;
        }

        .carousel-pricing {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }

        .checkout-btn {
          width: 100%;
          padding: 12px;
          background-color: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .checkout-btn:hover {
          background-color: #6d28d9;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          border-radius: 12px;
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .gallery-container.dark .modal-content {
          background-color: #1a1a1a;
        }

        .gallery-container.light .modal-content {
          background-color: #fff;
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: #7c3aed;
          cursor: pointer;
          z-index: 10;
        }

        .modal-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          padding: 30px;
        }

        .modal-image-section {
          position: relative;
        }

        .modal-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
        }

        .image-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .nav-btn {
          background-color: #7c3aed;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .nav-btn:hover {
          background-color: #6d28d9;
        }

        .image-counter {
          font-size: 14px;
          font-weight: 600;
        }

        .modal-info-section h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }

        .rating {
          font-size: 14px;
          margin-bottom: 15px;
        }

        .pricing-section {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .discount {
          background-color: #ff3b30;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .availability {
          margin-bottom: 20px;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-primary,
        .btn-secondary {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .btn-primary {
          background-color: #7c3aed;
          color: white;
        }

        .btn-primary:hover {
          background-color: #6d28d9;
        }

        .btn-secondary {
          background-color: transparent;
          border: 2px solid #7c3aed;
          color: #7c3aed;
        }

        .btn-secondary:hover {
          background-color: #7c3aed;
          color: white;
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
          }

          .carousel-slide,
          .modal-body {
            grid-template-columns: 1fr;
          }

          .carousel-slide {
            gap: 20px;
          }

          .modal-body {
            gap: 20px;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
