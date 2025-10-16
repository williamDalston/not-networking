import './globals.css'

export const metadata = {
  title: 'The Ecosystem - AI Networking Platform',
  description: 'AI-powered networking platform that connects like-minded individuals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}