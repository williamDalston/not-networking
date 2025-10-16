'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Brain, Target, Zap, Shield, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'SAM AI Discovery',
    description: 'Progressive, conversational onboarding that learns your strengths, needs, goals, and values.'
  },
  {
    icon: Target,
    title: 'Hyper-Explainable Matches',
    description: 'Every introduction comes with clear reasoning—see exactly why this connection matters.'
  },
  {
    icon: Users,
    title: 'Growth Circles',
    description: 'Peer groups of 4-6 people, formed by clustering and diversity constraints.'
  },
  {
    icon: Zap,
    title: 'Hybrid Events',
    description: 'Pre-intros, QR check-ins, and "Met [Name]" tracking for seamless networking.'
  },
  {
    icon: Shield,
    title: 'Ecosystem Compact',
    description: 'Built on curiosity, generosity, and thoughtful feedback—not transactional networking.'
  },
  {
    icon: TrendingUp,
    title: 'Capacity-Aware',
    description: 'Respects your time with weekly caps and readiness-based matching.'
  }
]

const testimonials = [
  {
    quote: "Finally, networking that actually works. SAM introduced me to three people who fundamentally changed my approach to product design.",
    author: "Sarah Chen",
    role: "Product Designer"
  },
  {
    quote: "The explanations are incredible. I know exactly why each match matters before I even reach out.",
    author: "Marcus Rodriguez",
    role: "Startup Founder"
  },
  {
    quote: "It's not just networking—it's building a real ecosystem of people who genuinely want to help each other grow.",
    author: "Dr. Aisha Patel",
    role: "Research Scientist"
  }
]

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold gradient-text">🌱 The Ecosystem</h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="#features" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Features
                </Link>
                <Link href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Testimonials
                </Link>
                <Link href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Get Started
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            >
              AI-Powered Professional
              <span className="block gradient-text">Networking</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Connect with like-minded professionals through intelligent matching and ecosystem visualization. 
              Built on SAM AI discovery and growth circles.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/auth/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#features" className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg border border-gray-300 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How The Ecosystem Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Six core principles that make networking meaningful, not transactional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                    <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real stories from professionals who've found meaningful connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600"
              >
                <blockquote className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your Professional Ecosystem?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already discovering meaningful connections through AI-powered matching.
          </p>
          <Link href="/auth/signup" className="bg-white hover:bg-gray-50 text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">🌱 The Ecosystem</h3>
            <p className="text-gray-400 mb-4">
              AI-powered professional networking that actually works
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 The Ecosystem. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}