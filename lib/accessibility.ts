/**
 * Accessibility utilities for The Ecosystem × SAM AI
 * 
 * Provides keyboard navigation, screen reader support, and ARIA utilities
 */

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle Enter and Space key activation
  handleActivation: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback()
    }
  },

  // Handle arrow key navigation
  handleArrowNavigation: (
    items: any[],
    currentIndex: number,
    onNavigate: (index: number) => void
  ) => (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        onNavigate((currentIndex + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        onNavigate(currentIndex === 0 ? items.length - 1 : currentIndex - 1)
        break
      case 'Home':
        e.preventDefault()
        onNavigate(0)
        break
      case 'End':
        e.preventDefault()
        onNavigate(items.length - 1)
        break
    }
  },

  // Trap focus within an element
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    
    // Return cleanup function
    return () => element.removeEventListener('keydown', handleTabKey)
  },

  // Focus management
  focus: {
    // Focus first focusable element
    first: (container: HTMLElement) => {
      const focusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      focusable?.focus()
    },

    // Focus last focusable element
    last: (container: HTMLElement) => {
      const focusable = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const last = focusable[focusable.length - 1] as HTMLElement
      last?.focus()
    },

    // Restore focus to previously focused element
    restore: (element: HTMLElement) => {
      element.focus()
    },
  },
}

// Screen reader utilities
export const screenReader = {
  // Announce message to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  // Create live region for dynamic content
  createLiveRegion: (id: string, priority: 'polite' | 'assertive' = 'polite') => {
    const region = document.createElement('div')
    region.id = id
    region.setAttribute('aria-live', priority)
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    document.body.appendChild(region)
    return region
  },

  // Update live region content
  updateLiveRegion: (id: string, content: string) => {
    const region = document.getElementById(id)
    if (region) {
      region.textContent = content
    }
  },
}

// ARIA utilities
export const aria = {
  // Generate unique ID for ARIA relationships
  generateId: (prefix: string = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },

  // Create ARIA label for complex interactions
  createLabel: (action: string, target: string, context?: string) => {
    let label = `${action} ${target}`
    if (context) {
      label += ` in ${context}`
    }
    return label
  },

  // Manage ARIA expanded state
  toggleExpanded: (element: HTMLElement, expanded: boolean) => {
    element.setAttribute('aria-expanded', expanded.toString())
  },

  // Manage ARIA selected state
  toggleSelected: (element: HTMLElement, selected: boolean) => {
    element.setAttribute('aria-selected', selected.toString())
  },

  // Manage ARIA pressed state
  togglePressed: (element: HTMLElement, pressed: boolean) => {
    element.setAttribute('aria-pressed', pressed.toString())
  },

  // Set ARIA described by relationship
  setDescribedBy: (element: HTMLElement, descriptionId: string) => {
    element.setAttribute('aria-describedby', descriptionId)
  },

  // Set ARIA labelled by relationship
  setLabelledBy: (element: HTMLElement, labelId: string) => {
    element.setAttribute('aria-labelledby', labelId)
  },
}

// Color contrast utilities
export const colorContrast = {
  // Check if color meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
  meetsWCAG: (foreground: string, background: string, isLargeText: boolean = false) => {
    const ratio = calculateContrastRatio(foreground, background)
    return isLargeText ? ratio >= 3 : ratio >= 4.5
  },

  // Get contrast ratio between two colors
  getRatio: (foreground: string, background: string) => {
    return calculateContrastRatio(foreground, background)
  },

  // Suggest accessible color alternatives
  suggestColors: (baseColor: string, background: string) => {
    // This would implement color suggestion logic
    // For now, return basic suggestions
    return {
      lighter: adjustColorBrightness(baseColor, 20),
      darker: adjustColorBrightness(baseColor, -20),
      higherContrast: getHighContrastColor(baseColor, background),
    }
  },
}

// Helper functions
function calculateContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getLuminance(color: string): number {
  // Simplified luminance calculation
  // In a real implementation, you'd parse the color and calculate proper luminance
  const rgb = hexToRgb(color)
  if (!rgb) return 0.5 // Default fallback
  
  const { r, g, b } = rgb
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function adjustColorBrightness(color: string, percent: number): string {
  // Simplified color adjustment
  // In a real implementation, you'd use a proper color manipulation library
  return color // Placeholder
}

function getHighContrastColor(color: string, background: string): string {
  // Simplified high contrast color suggestion
  // In a real implementation, you'd calculate the optimal contrast color
  return color // Placeholder
}

// Focus management hook
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = React.useState<HTMLElement | null>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  const saveFocus = React.useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = React.useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }, [])

  const trapFocus = React.useCallback((container: HTMLElement) => {
    return keyboardNavigation.trapFocus(container)
  }, [])

  return {
    focusedElement,
    setFocusedElement,
    saveFocus,
    restoreFocus,
    trapFocus,
  }
}

// Screen reader announcement hook
export function useScreenReader() {
  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    screenReader.announce(message, priority)
  }, [])

  const createLiveRegion = React.useCallback((id: string, priority: 'polite' | 'assertive' = 'polite') => {
    return screenReader.createLiveRegion(id, priority)
  }, [])

  const updateLiveRegion = React.useCallback((id: string, content: string) => {
    screenReader.updateLiveRegion(id, content)
  }, [])

  return {
    announce,
    createLiveRegion,
    updateLiveRegion,
  }
}

// ARIA management hook
export function useARIA() {
  const generateId = React.useCallback((prefix: string = 'aria') => {
    return aria.generateId(prefix)
  }, [])

  const createLabel = React.useCallback((action: string, target: string, context?: string) => {
    return aria.createLabel(action, target, context)
  }, [])

  const toggleExpanded = React.useCallback((element: HTMLElement, expanded: boolean) => {
    aria.toggleExpanded(element, expanded)
  }, [])

  const toggleSelected = React.useCallback((element: HTMLElement, selected: boolean) => {
    aria.toggleSelected(element, selected)
  }, [])

  const togglePressed = React.useCallback((element: HTMLElement, pressed: boolean) => {
    aria.togglePressed(element, pressed)
  }, [])

  return {
    generateId,
    createLabel,
    toggleExpanded,
    toggleSelected,
    togglePressed,
  }
}