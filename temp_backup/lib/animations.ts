/**
 * Animation utilities and presets for The Ecosystem × SAM AI
 * 
 * Reusable animation configurations using Framer Motion
 */

import { Variants, Transition } from 'framer-motion'

// Base transition configurations
export const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 25 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 10 },
  springGentle: { type: 'spring', stiffness: 200, damping: 30 },
} as const

// Common animation variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

export const slideDown: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
}

export const slideLeft: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
}

export const slideRight: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
}

export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
}

export const scaleUp: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
}

// Stagger animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
}

// Page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

// Modal animations
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const modalContent: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
}

// Bottom sheet animations (mobile)
export const bottomSheet: Variants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
}

// Toast animations
export const toast: Variants = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 300, opacity: 0 },
}

// Loading animations
export const pulse: Variants = {
  initial: { opacity: 1 },
  animate: { 
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Button animations
export const buttonTap: Variants = {
  tap: { scale: 0.98 },
}

export const buttonHover: Variants = {
  hover: { scale: 1.02 },
}

// Card hover animations
export const cardHover: Variants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: transitions.spring,
  },
}

// Form field animations
export const fieldError: Variants = {
  initial: { x: 0 },
  animate: { 
    x: [-4, 4, -4, 4, 0],
    transition: { duration: 0.5 },
  },
}

// Success animations
export const successBounce: Variants = {
  initial: { scale: 0 },
  animate: { 
    scale: [0, 1.2, 1],
    transition: transitions.springBouncy,
  },
}

// Micro-interactions
export const microBounce: Variants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.05 },
}

export const microRotate: Variants = {
  hover: { rotate: 5 },
  tap: { rotate: -5 },
}

// List animations
export const listItem: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

// Navigation animations
export const navItem: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

// Progress animations
export const progressBar: Variants = {
  initial: { width: 0 },
  animate: { 
    width: '100%',
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

// Shimmer animation for loading states
export const shimmer: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Floating animation for decorative elements
export const float: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Glow animation for focus states
export const glow: Variants = {
  initial: { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(16, 185, 129, 0)',
      '0 0 0 4px rgba(16, 185, 129, 0.1)',
      '0 0 0 0 rgba(16, 185, 129, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}

// Utility functions for custom animations
export const createStagger = (delay: number = 0.1): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: delay,
    },
  },
})

export const createSlideIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up'): Variants => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  }

  const initial = { ...directions[direction], opacity: 0 }
  const animate = { x: 0, y: 0, opacity: 1 }
  const exit = { ...directions[direction], opacity: 0 }

  return { initial, animate, exit }
}

export const createScaleIn = (scale: number = 0.9): Variants => ({
  initial: { scale, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale, opacity: 0 },
})