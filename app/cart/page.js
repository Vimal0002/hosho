"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../home.css';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="cart-page">
      <div className="container">
        <header className="cart-header">
          <Link href="/" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Shopping</span>
          </Link>
          <h1>Your Shopping Cart</h1>
        </header>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag size={80} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any premium tech to your cart yet.</p>
            <Link href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="item-image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <div className="item-category">{item.category}</div>
                    <h3>{item.name}</h3>
                    <p className="item-price-unit">{item.price}</p>
                  </div>
                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">
                      <Minus size={16} />
                    </button>
                    <span className="qty-number">{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="item-total">
                    ${(parseFloat(item.price.replace('$', '')) * (item.quantity || 1)).toFixed(2)}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn" aria-label="Remove item">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
              <button className="btn-checkout">
                Proceed to Checkout
              </button>
              <div className="checkout-info">
                <Zap size={16} />
                <span>Secure SSL encrypted checkout</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
