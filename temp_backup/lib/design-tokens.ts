/**
 * Design Tokens for The Ecosystem × SAM AI
 * 
 * Centralized design system tokens for consistent spacing, colors, elevation, and motion
 */

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
} as const

export const elevation = {
  none: 'none',
  card: 'shadow-sm',
  hover: 'shadow-md',
  dropdown: 'shadow-lg',
  modal: 'shadow-xl',
  toast: 'shadow-2xl',
} as const

export const motion = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
  },
  ease: {
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
} as const

export const colors = {
  // Semantic color variants
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    900: '#7f1d1d',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
} as const

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Playfair Display', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

// Animation presets for common use cases
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: motion.normal / 1000 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: motion.normal / 1000 },
  },
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: { duration: motion.normal / 1000 },
  },
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: motion.spring,
  },
  slideInFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: motion.normal / 1000 },
  },
  slideInFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: motion.normal / 1000 },
  },
} as const

// Accessibility helpers
export const focusRing = {
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
  visibleDark: 'dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-900',
} as const

export const touchTarget = {
  min: 'min-h-[44px] min-w-[44px]', // WCAG AA minimum touch target
  recommended: 'min-h-[48px] min-w-[48px]', // Recommended touch target
} as const

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: 'h-9',
      md: 'h-10',
      lg: 'h-11',
      xl: 'h-12',
    },
    padding: {
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2',
      lg: 'px-6 py-3',
      xl: 'px-8 py-4',
    },
  },
  input: {
    height: 'h-10',
    padding: 'px-3 py-2',
    borderRadius: 'rounded-md',
  },
  card: {
    padding: 'p-6',
    borderRadius: 'rounded-xl',
    shadow: elevation.card,
  },
  modal: {
    backdrop: 'bg-black/50 backdrop-blur-sm',
    maxWidth: 'max-w-md',
    borderRadius: 'rounded-2xl',
    shadow: elevation.modal,
  },
} as const
