'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, Smartphone, Tablet, Palette, Sun, Moon } from 'lucide-react'

export function ResponsiveDesignTest() {
  const [screenSize, setScreenSize] = useState('desktop')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize('mobile')
      else if (width < 1024) setScreenSize('tablet')
      else setScreenSize('desktop')
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const testComponents = [
    {
      title: 'Buttons',
      component: (
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="magic">Magic</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      )
    },
    {
      title: 'Cards',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">This is a default card with standard styling.</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">This is a glass morphism card with backdrop blur.</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: 'Gradient Text',
      component: (
        <div className="space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Animated Gradient Text</h1>
          <h2 className="text-2xl font-semibold gradient-text-static">Static Gradient Text</h2>
          <h3 className="text-xl font-medium gradient-text-emerald">Emerald Gradient</h3>
          <h4 className="text-lg font-medium gradient-text-gold">Gold Gradient</h4>
        </div>
      )
    },
    {
      title: 'Color Palette',
      component: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Emerald</h4>
            <div className="space-y-1">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div
                  key={shade}
                  className={`h-6 bg-emerald-${shade} rounded flex items-center justify-center text-xs font-medium ${
                    shade > 500 ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {shade}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Gold</h4>
            <div className="space-y-1">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div
                  key={shade}
                  className={`h-6 bg-gold-${shade} rounded flex items-center justify-center text-xs font-medium ${
                    shade > 500 ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {shade}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Violet</h4>
            <div className="space-y-1">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div
                  key={shade}
                  className={`h-6 bg-violet-${shade} rounded flex items-center justify-center text-xs font-medium ${
                    shade > 500 ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {shade}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Sky</h4>
            <div className="space-y-1">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div
                  key={shade}
                  className={`h-6 bg-sky-${shade} rounded flex items-center justify-center text-xs font-medium ${
                    shade > 500 ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {shade}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Design System Test</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Testing responsive design and color consistency across different screen sizes and themes
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Screen Size Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                {screenSize === 'mobile' && <Smartphone className="h-5 w-5 text-emerald-500" />}
                {screenSize === 'tablet' && <Tablet className="h-5 w-5 text-emerald-500" />}
                {screenSize === 'desktop' && <Monitor className="h-5 w-5 text-emerald-500" />}
                <span className="text-sm font-medium capitalize">{screenSize}</span>
              </div>
              
              {/* Theme Toggle */}
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === 'light' ? 'Dark' : 'Light'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Test Components */}
        <div className="space-y-8">
          {testComponents.map((test, index) => (
            <motion.div
              key={test.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-emerald-500" />
                    {test.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {test.component}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Responsive Grid Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card variant="glass" className="p-6">
            <CardHeader>
              <CardTitle>Responsive Grid Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gradient-to-br from-emerald-100 to-gold-100 dark:from-emerald-900/20 dark:to-gold-900/20 rounded-xl flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Item {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
