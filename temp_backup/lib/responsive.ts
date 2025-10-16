// Responsive utilities and mobile optimization helpers

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`
} as const

// Mobile-first responsive classes
export const responsive = {
  // Grid layouts
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
    wide: 'xl:grid-cols-4'
  },
  
  // Spacing
  spacing: {
    mobile: 'p-4 space-y-4',
    tablet: 'md:p-6 md:space-y-6',
    desktop: 'lg:p-8 lg:space-y-8'
  },
  
  // Text sizes
  text: {
    h1: 'text-2xl md:text-3xl lg:text-4xl',
    h2: 'text-xl md:text-2xl lg:text-3xl',
    h3: 'text-lg md:text-xl lg:text-2xl',
    body: 'text-sm md:text-base',
    small: 'text-xs md:text-sm'
  },
  
  // Button sizes
  button: {
    mobile: 'w-full py-3 px-4 text-base',
    tablet: 'md:w-auto md:py-2 md:px-4 md:text-sm',
    desktop: 'lg:py-3 lg:px-6'
  },
  
  // Card layouts
  card: {
    mobile: 'p-4 rounded-lg',
    tablet: 'md:p-6 md:rounded-xl',
    desktop: 'lg:p-8'
  }
} as const

// Touch-friendly sizing for mobile
export const touchFriendly = {
  // Minimum touch target size (44px)
  minSize: 'min-h-[44px] min-w-[44px]',
  
  // Button padding for touch
  buttonPadding: 'py-3 px-4',
  
  // Input padding for touch
  inputPadding: 'py-3 px-4',
  
  // Card spacing for touch
  cardSpacing: 'p-4 space-y-4'
} as const

// Mobile-specific utilities
export const mobile = {
  // Hide on mobile
  hidden: 'hidden md:block',
  
  // Show only on mobile
  only: 'block md:hidden',
  
  // Mobile navigation
  nav: 'fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto',
  
  // Mobile-safe margins
  safeArea: 'pb-safe md:pb-0',
  
  // Touch scrolling
  scroll: 'overflow-y-auto overscroll-y-contain',
  
  // Mobile-first spacing
  spacing: {
    container: 'px-4 md:px-6 lg:px-8',
    section: 'py-6 md:py-8 lg:py-12',
    card: 'p-4 md:p-6 lg:p-8'
  }
} as const

// Responsive grid helpers
export const grid = {
  // Auto-responsive columns
  auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  
  // Match cards
  matches: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // Event cards
  events: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // Dashboard layout
  dashboard: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  
  // Profile layout
  profile: 'grid grid-cols-1 lg:grid-cols-3 gap-6'
} as const

// Animation delays for staggered mobile animations
export const stagger = {
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.1 }
  },
  
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }
} as const

// Mobile gesture helpers
export const gestures = {
  // Swipe detection
  swipe: {
    threshold: 50,
    velocity: 0.3
  },
  
  // Pinch zoom
  pinch: {
    min: 0.5,
    max: 3,
    initial: 1
  }
} as const

// Viewport utilities
export const viewport = {
  // Mobile viewport
  mobile: 'w-screen h-screen overflow-hidden',
  
  // Desktop viewport
  desktop: 'min-h-screen',
  
  // Full height
  fullHeight: 'h-screen md:min-h-screen'
} as const
