'use client'

import { useState, useEffect } from 'react'

// Hook to detect screen size and device type
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      
      if (width < 768) {
        setIsMobile(true)
        setIsTablet(false)
        setIsDesktop(false)
        setScreenSize('mobile')
      } else if (width < 1024) {
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
        setScreenSize('tablet')
      } else {
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
        setScreenSize('desktop')
      }
    }

    // Check initial size
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize
  }
}

// Hook to detect touch capability
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouchDevice
}

// Hook for responsive values
export function useResponsiveValue<T>(values: {
  mobile: T
  tablet?: T
  desktop?: T
}): T {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  if (isMobile) return values.mobile
  if (isTablet && values.tablet !== undefined) return values.tablet
  if (isDesktop && values.desktop !== undefined) return values.desktop
  
  return values.mobile
}

// Hook for responsive breakpoint detection
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<string>('mobile')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width >= 1536) setBreakpoint('2xl')
      else if (width >= 1280) setBreakpoint('xl')
      else if (width >= 1024) setBreakpoint('lg')
      else if (width >= 768) setBreakpoint('md')
      else if (width >= 640) setBreakpoint('sm')
      else setBreakpoint('mobile')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}
