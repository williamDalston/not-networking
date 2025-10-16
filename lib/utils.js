import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
}

export function generateMatchExplanation(match: any, user1: any, user2: any) {
  const explanations = []
  
  // Check for complementary strengths/needs
  if (match.evidence?.complementary_matches) {
    explanations.push(`You both have complementary skills that could benefit each other.`)
  }
  
  // Check for shared goals
  if (match.evidence?.shared_goals) {
    explanations.push(`You share similar professional goals and could collaborate effectively.`)
  }
  
  // Check for aligned values
  if (match.evidence?.aligned_values) {
    explanations.push(`Your values align well, creating a strong foundation for meaningful connection.`)
  }
  
  // Check for industry overlap
  if (match.evidence?.industry_overlap) {
    explanations.push(`You're both in related industries, opening opportunities for knowledge sharing.`)
  }
  
  return explanations.join(' ') || 'This match shows potential for meaningful professional connection.'
}

export function calculateMatchScore(user1: any, user2: any) {
  let score = 0
  let factors = 0
  
  // Complementary strengths/needs (40% weight)
  if (user1.strengths && user2.needs) {
    const overlap = user1.strengths.filter((s: string) => 
      user2.needs.some((n: string) => n.toLowerCase().includes(s.toLowerCase()))
    ).length
    score += (overlap / Math.max(user1.strengths.length, user2.needs.length)) * 0.4
    factors++
  }
  
  // Shared goals (30% weight)
  if (user1.goals && user2.goals) {
    const sharedGoals = user1.goals.filter((g: string) => 
      user2.goals.some((g2: string) => g2.toLowerCase().includes(g.toLowerCase()))
    ).length
    score += (sharedGoals / Math.max(user1.goals.length, user2.goals.length)) * 0.3
    factors++
  }
  
  // Aligned values (20% weight)
  if (user1.values && user2.values) {
    const alignedValues = user1.values.filter((v: string) => 
      user2.values.some((v2: string) => v2.toLowerCase().includes(v.toLowerCase()))
    ).length
    score += (alignedValues / Math.max(user1.values.length, user2.values.length)) * 0.2
    factors++
  }
  
  // Industry overlap (10% weight)
  if (user1.industry && user2.industry) {
    if (user1.industry.toLowerCase() === user2.industry.toLowerCase()) {
      score += 0.1
    }
    factors++
  }
  
  return factors > 0 ? Math.round(score * 100) / 100 : 0
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string) {
  return password.length >= 8
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle(func: Function, limit: number) {
  let inThrottle: boolean
  return function executedFunction(...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
