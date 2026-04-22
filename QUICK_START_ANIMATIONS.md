# 🚀 Quick Start Guide - Magic UI & Animation Examples

## 5-Minute Setup

### 1. Basic Animated Section
```jsx
'use client';

import { AnimatedSection } from '@/app/components/MagicUIWrapper';

export default function Home() {
  return (
    <AnimatedSection>
      <h1>Welcome to ElectroMinds</h1>
      <p>With smooth animations!</p>
    </AnimatedSection>
  );
}
```

### 2. Staggered List
```jsx
'use client';

import { StaggerContainer, StaggerItem } from '@/app/components/MagicUIWrapper';

export default function ProductList() {
  const products = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Phone' },
    { id: 3, name: 'Tablet' },
  ];

  return (
    <StaggerContainer>
      {products.map((product) => (
        <StaggerItem key={product.id}>
          <div className="product-item">{product.name}</div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

### 3. Hover Scale Button
```jsx
'use client';

import { HoverScale } from '@/app/components/MagicUIWrapper';

export default function Button() {
  return (
    <HoverScale scale={1.1}>
      <button className="your-button">Click Me</button>
    </HoverScale>
  );
}
```

### 4. Slide In Animation
```jsx
'use client';

import { SlideIn } from '@/app/components/MagicUIWrapper';

export default function Header() {
  return (
    <SlideIn direction="down" delay={0}>
      <header>Header</header>
    </SlideIn>
  );
}
```

---

## Common Use Cases

### Fade in Text on Page Load
```jsx
import { FadeIn } from '@/app/components/MagicUIWrapper';

<FadeIn delay={0.2} duration={0.6}>
  <h1>Beautiful Page Title</h1>
</FadeIn>
```

### Animated Product Gallery
```jsx
'use client';

import ProductCardEnhanced from '@/app/components/ProductCardEnhanced';
import { StaggerContainer, StaggerItem } from '@/app/components/MagicUIWrapper';

export default function Gallery() {
  const products = [/* your products */];

  return (
    <StaggerContainer delay={0} staggerDelay={0.1}>
      {products.map((product, i) => (
        <StaggerItem key={product.id}>
          <ProductCardEnhanced
            {...product}
            delay={i * 0.1}
          />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

### Scroll Triggered Animation
```jsx
import { AnimatedSection } from '@/app/components/MagicUIWrapper';

<AnimatedSection delay={0.3}>
  <div className="feature">
    <h2>Feature Title</h2>
    <p>Appears when scrolled into view</p>
  </div>
</AnimatedSection>
```

### Floating Button
```jsx
import { FloatAnimation } from '@/app/components/MagicUIWrapper';

<FloatAnimation>
  <button className="floating-btn">Chat</button>
</FloatAnimation>
```

### Pulsing Loading State
```jsx
import { PulseAnimation } from '@/app/components/MagicUIWrapper';

<PulseAnimation>
  <div className="loading">Loading...</div>
</PulseAnimation>
```

### Shimmer Loading Skeleton
```jsx
import { ShimmerEffect } from '@/app/components/MagicUIWrapper';

<ShimmerEffect width="100%" height="20px" />
<ShimmerEffect width="80%" height="16px" />
```

### Rotating Loading Icon
```jsx
import { RotateAnimation } from '@/app/components/MagicUIWrapper';

<RotateAnimation duration={2}>
  <div className="icon">⚙️</div>
</RotateAnimation>
```

### Animated Gradient Text
```jsx
import { GradientText } from '@/app/components/MagicUIWrapper';

<GradientText fromColor="#7c3aed" toColor="#ec4899">
  ElectroMinds
</GradientText>
```

---

## Animation Props Reference

### All Animations Support
```jsx
<AnimationType
  delay={0}        // Delay in seconds
  duration={0.5}   // Duration in seconds
  children={...}   // Content to animate
>
```

### SlideIn Directions
```jsx
<SlideIn direction="left">    // From left
<SlideIn direction="right">   // From right
<SlideIn direction="up">      // From up
<SlideIn direction="down">    // From down
```

### HoverScale Scale Options
```jsx
<HoverScale scale={1.05}>     // Slight zoom
<HoverScale scale={1.1}>      // Medium zoom
<HoverScale scale={1.2}>      // Large zoom
```

---

## Real-World Example: Product Page

```jsx
'use client';

import { 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem,
  SlideIn,
  FadeIn 
} from '@/app/components/MagicUIWrapper';
import ProductCardEnhanced from '@/app/components/ProductCardEnhanced';

export default function ProductPage() {
  const products = [
    {
      id: 1,
      name: 'Laptop Pro',
      price: 1299.99,
      image: '/laptop.jpg',
      rating: 4.8,
      reviews: 256,
    },
    // ... more products
  ];

  return (
    <div className="page">
      {/* Animated Header */}
      <SlideIn direction="down">
        <header className="page-header">
          <h1>Electronics Store</h1>
        </header>
      </SlideIn>

      {/* Fade in Intro */}
      <FadeIn delay={0.2}>
        <div className="intro">
          <p>Browse our amazing collection of electronics</p>
        </div>
      </FadeIn>

      {/* Staggered Product Grid */}
      <section className="products">
        <StaggerContainer delay={0.3} staggerDelay={0.1}>
          {products.map((product, index) => (
            <StaggerItem key={product.id}>
              <ProductCardEnhanced
                {...product}
                delay={index * 0.05}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Animated Footer Section */}
      <AnimatedSection delay={0.5}>
        <footer className="page-footer">
          <p>© 2026 ElectroMinds. All rights reserved.</p>
        </footer>
      </AnimatedSection>
    </div>
  );
}
```

---

## Performance Tips

### Reduce Motion for Users
```jsx
'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  return prefersReducedMotion;
}

// Usage
const prefersReducedMotion = useReducedMotion();
const duration = prefersReducedMotion ? 0.1 : 0.5;

<FadeIn duration={duration}>Content</FadeIn>
```

### Only Animate Once
```jsx
// Components with viewport={{ once: true }} only animate when first scrolled into view

<AnimatedSection>  {/* Animates once */}
  Content
</AnimatedSection>
```

---

## CSS Integration

Your animations work seamlessly with your existing CSS:

```css
/* Your existing styles still work */
.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

/* Animations layer on top */
<ProductCardEnhanced className="product-card" />
```

---

## Troubleshooting

### Animation not showing?
- Make sure component is marked with `'use client'`
- Check that `framer-motion` is installed: `npm list framer-motion`
- Verify parent container has proper dimensions

### Animation feels slow?
- Reduce `duration` prop
- Use `viewport={{ amount: 0.5 }}` for earlier trigger
- Check browser performance settings

### Animation conflicts with CSS?
- Use `style` prop for framer-motion properties
- Or use CSS in separate stylesheet
- Don't duplicate properties in both places

---

## Browser Support

✅ All modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Next Steps

1. **Try the examples** - Copy and paste into your components
2. **Mix and match** - Combine different animations
3. **Customize** - Adjust delays, durations, and effects
4. **Deploy** - Everything is production-ready!

---

Happy animating! 🎨✨
