import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'The Ecosystem - AI-Powered Professional Networking',
  description: 'Connect with like-minded professionals through intelligent matching and ecosystem visualization. Built on SAM AI discovery and growth circles.',
  keywords: 'networking, AI, professional development, connections, ecosystem',
  authors: [{ name: 'The Ecosystem Team' }],
  openGraph: {
    title: 'The Ecosystem - AI-Powered Professional Networking',
    description: 'Connect with like-minded professionals through intelligent matching and ecosystem visualization.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Ecosystem - AI-Powered Professional Networking',
    description: 'Connect with like-minded professionals through intelligent matching and ecosystem visualization.',
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}