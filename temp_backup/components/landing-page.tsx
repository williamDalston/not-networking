'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Brain, Target, Zap, Shield, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
    role: "Tech Founder"
  },
  {
    quote: "Growth Circles gave me a safe space to explore new ideas with people who truly understood my challenges.",
    author: "Priya Patel",
    role: "Engineering Manager"
  }
]

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-gold-500" />
          <span className="text-xl font-display font-semibold gradient-text">
            Ecosystem × SAM
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/auth/login">
            <Button variant="outline" className="rounded-2xl">
              Sign In
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-6 text-5xl font-display font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">Not networking.</span>
              <br />
              <span className="text-gray-900 dark:text-white">Aligning.</span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              SAM AI learns who you are, what you need, and who complements you—then curates 
              introductions that actually move your life and work forward.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="ecosystem-button group"
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Getting Started...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Join the Ecosystem</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </Button>
            </Link>
            
            <Link href="/about">
              <Button variant="outline" size="lg" className="rounded-2xl">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-10 top-20 h-32 w-32 rounded-full bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-10 top-40 h-24 w-24 rounded-full bg-gradient-to-r from-gold-400/20 to-gold-600/20 blur-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-display font-bold text-gray-900 dark:text-white sm:text-4xl">
              Built for authentic human synergy
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Every feature is designed to create connections that compound into collaboration, learning, and impact.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-display font-bold text-gray-900 dark:text-white sm:text-4xl">
              Real stories from the ecosystem
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              See how SAM AI is creating meaningful connections that matter.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <blockquote className="mb-4 text-gray-700 dark:text-gray-300">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-gold-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-display font-bold text-gray-900 dark:text-white sm:text-4xl">
              Ready to find your people?
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Join the pilot cohort of 100 users in Tbilisi and experience the future of professional networking.
            </p>
            
            <Link href="/auth/signup">
              <Button size="lg" className="ecosystem-button">
                <div className="flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-500 to-gold-500" />
              <span className="font-display font-semibold gradient-text">
                Ecosystem × SAM
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
            <p>© 2024 Ecosystem × SAM AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
