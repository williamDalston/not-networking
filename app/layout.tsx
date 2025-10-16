import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { generateSEO } from '@/lib/seo'
import { SkipToMainContent } from '@/components/ui/skip-link'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})

export const metadata: Metadata = generateSEO({
  title: 'The Ecosystem × SAM AI - Not networking. Aligning.',
  description: 'SAM AI learns who you are, what you need, and who complements you—then curates introductions that actually move your life and work forward.',
  keywords: ['networking', 'AI', 'matching', 'professional development', 'collaboration'],
  url: 'https://ecosystem-sam-ai.vercel.app',
  type: 'website'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <SkipToMainContent />
        <Providers>
          <main id="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
