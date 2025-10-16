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
    <div className="min-h-screen gradient-bg-animated">
      {/* Navigation */}
      <nav className="relative z-50 glass border-b border-white/20 dark:border-gray-700/20">
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
                <Link href="/auth/signin" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
                  Get Started
                </Link>
                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/onboarding" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Onboarding
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
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-300/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-gold-500 rounded-2xl mb-6 animate-heartbeat">
                <span className="text-3xl">🌱</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 text-shadow"
            >
              AI-Powered Professional
              <span className="block gradient-text text-glow">Networking</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with like-minded professionals through intelligent matching and ecosystem visualization. 
              Built on SAM AI discovery and growth circles.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/auth/signup" className="btn-magic px-8 py-4 text-lg flex items-center group">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="btn-secondary px-8 py-4 text-lg">
                Learn More
              </Link>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>Trusted by 10,000+ professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>95% match satisfaction rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>AI-powered precision</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-shadow">
              How The Ecosystem Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Six core principles that make networking meaningful, not transactional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 card-hover group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl group-hover:scale-110 transition-transform duration-200">
                    <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 gradient-bg-animated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-shadow">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real stories from professionals who've found meaningful connections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 card-hover group"
              >
                <div className="mb-4">
                  <div className="text-emerald-500 text-2xl mb-2">"</div>
                  <blockquote className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                    {testimonial.quote}
                  </blockquote>
                  <div className="text-emerald-500 text-2xl text-right">"</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
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
      <section className="py-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-gold-600"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-shadow">
              Ready to Build Your Professional Ecosystem?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who are already discovering meaningful connections through AI-powered matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup" className="bg-white hover:bg-gray-50 text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center group">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="text-white hover:text-emerald-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 inline-flex items-center border border-white/30 hover:border-white/50">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gold-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-gold-500 rounded-2xl mb-6 animate-heartbeat">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text-static">The Ecosystem</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                AI-powered professional networking that actually works
              </p>
              <div className="flex justify-center space-x-6 mb-6">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-500 text-sm">
                © 2024 The Ecosystem. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}