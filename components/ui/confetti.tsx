'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
  colors?: string[]
  particleCount?: number
  duration?: number
  className?: string
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  velocity: {
    x: number
    y: number
    rotation: number
  }
}

export const Confetti: React.FC<ConfettiProps> = ({
  isActive,
  onComplete,
  colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  particleCount = 50,
  duration = 3000,
  className,
}) => {
  const [particles, setParticles] = React.useState<Particle[]>([])
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>()
  const startTimeRef = React.useRef<number>()

  const createParticles = React.useCallback(() => {
    const newParticles: Particle[] = []
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 3 + 2,
          rotation: (Math.random() - 0.5) * 10,
        },
      })
    }
    
    return newParticles
  }, [particleCount, colors])

  const updateParticles = React.useCallback((particles: Particle[], deltaTime: number) => {
    return particles.map(particle => ({
      ...particle,
      x: particle.x + particle.velocity.x,
      y: particle.y + particle.velocity.y,
      rotation: particle.rotation + particle.velocity.rotation,
      velocity: {
        ...particle.velocity,
        y: particle.velocity.y + 0.1, // gravity
      },
    })).filter(particle => 
      particle.y < window.innerHeight + 100 && 
      particle.x > -100 && 
      particle.x < window.innerWidth + 100
    )
  }, [])

  const drawParticles = React.useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(particle => {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate((particle.rotation * Math.PI) / 180)
      
      // Draw confetti piece
      ctx.fillStyle = particle.color
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
      
      // Add some sparkle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fillRect(-particle.size / 4, -particle.size / 4, particle.size / 2, particle.size / 2)
      
      ctx.restore()
    })
  }, [])

  const animate = React.useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const deltaTime = timestamp - (startTimeRef.current || timestamp)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    setParticles(prevParticles => {
      const updatedParticles = updateParticles(prevParticles, deltaTime)
      drawParticles(ctx, updatedParticles)
      
      // Check if animation is complete
      if (updatedParticles.length === 0 && deltaTime > duration) {
        onComplete?.()
        return []
      }
      
      return updatedParticles
    })

    if (deltaTime < duration) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [updateParticles, drawParticles, duration, onComplete])

  // Start animation when active
  React.useEffect(() => {
    if (isActive) {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      
      setParticles(createParticles())
      startTimeRef.current = undefined
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, createParticles, animate])

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className={`
        fixed inset-0 pointer-events-none z-50
        ${className || ''}
      `}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  )
}

// Celebration confetti for specific achievements
export const CelebrationConfetti: React.FC<{
  trigger: boolean
  type?: 'success' | 'achievement' | 'welcome'
}> = ({ trigger, type = 'success' }) => {
  const [isActive, setIsActive] = React.useState(false)

  const confettiConfigs = {
    success: {
      colors: ['#10b981', '#34d399', '#6ee7b7'],
      particleCount: 40,
      duration: 2000,
    },
    achievement: {
      colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'],
      particleCount: 60,
      duration: 3000,
    },
    welcome: {
      colors: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
      particleCount: 50,
      duration: 2500,
    },
  }

  const config = confettiConfigs[type]

  React.useEffect(() => {
    if (trigger) {
      setIsActive(true)
    }
  }, [trigger])

  return (
    <Confetti
      isActive={isActive}
      onComplete={() => setIsActive(false)}
      {...config}
    />
  )
}

// Success confetti component
export const SuccessConfetti: React.FC<{ trigger: boolean }> = ({ trigger }) => (
  <CelebrationConfetti trigger={trigger} type="success" />
)

// Achievement confetti component
export const AchievementConfetti: React.FC<{ trigger: boolean }> = ({ trigger }) => (
  <CelebrationConfetti trigger={trigger} type="achievement" />
)

// Welcome confetti component
export const WelcomeConfetti: React.FC<{ trigger: boolean }> = ({ trigger }) => (
  <CelebrationConfetti trigger={trigger} type="welcome" />
)
