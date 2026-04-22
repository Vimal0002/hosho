'use client';

import ServerHeader from './ServerHeader';
import Footer from './Footer';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import Categories from './Categories';
import { useState } from 'react';

export default function SimpleHomePage() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Sample products
  const featuredProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'Latest Apple smartphone with A17 Pro chip',
      price: '$999',
      originalPrice: '$1099',
      image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
      rating: 4.8,
      reviews: 256,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      description: 'Flagship Android phone with AI features',
      price: '$899',
      originalPrice: '$999',
      image: 'https://via.placeholder.com/300x300?text=Galaxy+S24',
      rating: 4.6,
      reviews: 189,
      badge: 'New'
    },
    {
      id: 3,
      name: 'MacBook Pro 14"',
      description: 'Powerful laptop for professionals',
      price: '$1999',
      originalPrice: '$2199',
      image: 'https://via.placeholder.com/300x300?text=MacBook+Pro',
      rating: 4.9,
      reviews: 342,
      badge: 'Popular'
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      description: 'Premium noise-cancelling headphones',
      price: '$349',
      originalPrice: '$399',
      image: 'https://via.placeholder.com/300x300?text=Sony+Headphones',
      rating: 4.7,
      reviews: 512,
      badge: 'Top Rated'
    }
  ];

  const categories = [
    { id: 1, name: 'Smartphones', count: 1250, icon: '📱' },
    { id: 2, name: 'Laptops', count: 890, icon: '💻' },
    { id: 3, name: 'Tablets', count: 450, icon: '📲' },
    { id: 4, name: 'Accessories', count: 2100, icon: '🎧' }
  ];

  const handleAddCart = (product) => {
    setCart([...cart, product]);
    console.log('Added to cart:', product.name);
  };

  const handleWishlist = (product) => {
    setWishlist([...wishlist, product]);
    console.log('Added to wishlist:', product.name);
  };

  const handleHeroShop = () => {
    console.log('Shop Now clicked');
  };

  const handleHeroLearn = () => {
    console.log('Learn More clicked');
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category.name);
  };

  return (
    <>
      <ServerHeader />

      <main>
        {/* Hero Section */}
        <HeroSection
          title="Welcome to ElectroMinds"
          subtitle="Discover the latest electronics with AI-powered recommendations"
          backgroundImage="https://via.placeholder.com/1200x400/2563eb/ffffff?text=ElectroMinds"
          ctaText="Shop Now"
          ctaSecondary="Learn More"
          onCTA={handleHeroShop}
          onCTASecondary={handleHeroLearn}
        />

        {/* Featured Products */}
        <FeaturedProducts
          title="Featured Products"
          subtitle="Handpicked selection of our best sellers"
          products={featuredProducts}
          onAddCart={handleAddCart}
          onWishlist={handleWishlist}
        />

        {/* Categories */}
        <Categories
          title="Shop by Category"
          subtitle="Browse our wide selection of products"
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />

        {/* CTA Section */}
        <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div className="section-content">
            <h2 className="section-title">Ready to Get Started?</h2>
            <p className="section-subtitle">
              Explore thousands of products and find exactly what you need with our AI-powered recommendations.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleHeroShop}
              style={{ marginTop: 'var(--spacing-6)' }}
            >
              Explore Products
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
