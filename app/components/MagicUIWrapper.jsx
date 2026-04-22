'use client';

import { motion } from 'framer-motion';

// Animated Section - fades in when scrolled into view
export const AnimatedSection = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true, amount: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Fade In - simple fade animation
export const FadeIn = ({ children, delay = 0, duration = 0.4 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

// Slide In - slides from specified direction
export const SlideIn = ({ 
  children, 
  direction = 'left', 
  delay = 0, 
  duration = 0.5 
}) => {
  const variants = {
    left: { 
      initial: { x: -50, opacity: 0 }, 
      animate: { x: 0, opacity: 1 } 
    },
    right: { 
      initial: { x: 50, opacity: 0 }, 
      animate: { x: 0, opacity: 1 } 
    },
    up: { 
      initial: { y: 50, opacity: 0 }, 
      animate: { y: 0, opacity: 1 } 
    },
    down: { 
      initial: { y: -50, opacity: 0 }, 
      animate: { y: 0, opacity: 1 } 
    },
  };

  return (
    <motion.div
      variants={variants[direction]}
      initial="initial"
      animate="animate"
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
};

// Scale In - grows from smaller size
export const ScaleIn = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

// Bounce In - bouncy entrance animation
export const BounceIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      delay,
      type: 'spring',
      stiffness: 100,
      damping: 15,
    }}
  >
    {children}
  </motion.div>
);

// Stagger Container - for animating multiple children sequentially
export const StaggerContainer = ({ 
  children, 
  delay = 0, 
  staggerDelay = 0.1 
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

// Stagger Item - child of StaggerContainer
export const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    {children}
  </motion.div>
);

// Float Animation - subtle floating effect
export const FloatAnimation = ({ children, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
    }}
  >
    {children}
  </motion.div>
);

// Pulse Animation - pulsing glow effect
export const PulseAnimation = ({ children, delay = 0 }) => (
  <motion.div
    animate={{ opacity: [1, 0.6, 1] }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay,
    }}
  >
    {children}
  </motion.div>
);

// Shimmer Effect - loading shimmer animation
export const ShimmerEffect = ({ width = '100%', height = '20px' }) => (
  <motion.div
    className="shimmer-effect"
    style={{
      width,
      height,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)',
      backgroundSize: '200% 100%',
      borderRadius: '8px',
    }}
    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
    transition={{ duration: 2, repeat: Infinity }}
  />
);

// Hover Scale - scales on hover
export const HoverScale = ({ 
  children, 
  scale = 1.05, 
  className = '' 
}) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Flip Card - 3D flip animation
export const FlipCard = ({ front, back, duration = 0.6 }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <motion.div
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        perspective: 1000,
        cursor: 'pointer',
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {front}
        </motion.div>
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          }}
        >
          {back}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Rotate Animation - continuous rotation
export const RotateAnimation = ({ children, duration = 20 }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    {children}
  </motion.div>
);

// Gradient Text - animated gradient text
export const GradientText = ({ 
  children, 
  fromColor = '#7c3aed', 
  toColor = '#ec4899' 
}) => (
  <motion.span
    style={{
      background: `linear-gradient(90deg, ${fromColor}, ${toColor})`,
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    {children}
  </motion.span>
);

export default {
  AnimatedSection,
  FadeIn,
  SlideIn,
  ScaleIn,
  BounceIn,
  StaggerContainer,
  StaggerItem,
  FloatAnimation,
  PulseAnimation,
  ShimmerEffect,
  HoverScale,
  FlipCard,
  RotateAnimation,
  GradientText,
};
