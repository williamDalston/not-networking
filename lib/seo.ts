// SEO metadata and optimization utilities

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  siteName?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

const defaultSEO = {
  siteName: 'The Ecosystem × SAM AI',
  title: 'The Ecosystem × SAM AI - Intelligent Professional Networking',
  description: 'Connect with professionals who share your values, goals, and skills. SAM AI matches you with meaningful connections based on what you\'re working on and where you want to grow.',
  keywords: [
    'professional networking',
    'AI matching',
    'career growth',
    'skill development',
    'meaningful connections',
    'professional development',
    'networking platform',
    'career advancement',
    'collaboration',
    'mentorship'
  ],
  image: '/og-image.png',
  url: 'https://ecosystem-sam-ai.vercel.app',
  type: 'website' as const,
  author: 'The Ecosystem Team'
}

export function generateSEO(seo: SEOProps = {}) {
  const title = seo.title ? `${seo.title} | ${defaultSEO.siteName}` : defaultSEO.title
  const description = seo.description || defaultSEO.description
  const url = seo.url || defaultSEO.url
  const image = seo.image || defaultSEO.image
  const keywords = [...defaultSEO.keywords, ...(seo.keywords || [])].join(', ')

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'en_US',
      type: seo.type || defaultSEO.type
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@ecosystem_sam_ai'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: url
    }
  }
}

// Page-specific SEO configurations
export const pageSEO = {
  home: generateSEO({
    title: 'The Ecosystem × SAM AI',
    description: 'Intelligent professional networking that connects you with people who share your values, goals, and skills. Find meaningful connections and grow together.',
    keywords: ['professional networking', 'AI matching', 'career growth']
  }),

  dashboard: generateSEO({
    title: 'Dashboard',
    description: 'Your personalized dashboard with matches, insights, and growth tracking.',
    keywords: ['dashboard', 'matches', 'insights', 'growth tracking']
  }),

  matches: generateSEO({
    title: 'Your Matches',
    description: 'Discover professionals who share your values and goals. SAM AI has found meaningful connections for you.',
    keywords: ['matches', 'connections', 'professional networking', 'AI matching']
  }),

  profile: generateSEO({
    title: 'Your Profile',
    description: 'Manage your professional profile and preferences.',
    keywords: ['profile', 'professional profile', 'settings']
  }),

  events: generateSEO({
    title: 'Events',
    description: 'Join networking events and workshops to connect with like-minded professionals.',
    keywords: ['events', 'networking events', 'workshops', 'professional development']
  }),

  ecosystem: generateSEO({
    title: 'Ecosystem Map',
    description: 'Explore the network of connections, skills, and shared goals in our community.',
    keywords: ['ecosystem', 'network visualization', 'community', 'connections']
  }),

  onboarding: generateSEO({
    title: 'Get Started',
    description: 'Complete your profile to start finding meaningful professional connections.',
    keywords: ['onboarding', 'profile setup', 'getting started']
  }),

  login: generateSEO({
    title: 'Sign In',
    description: 'Sign in to your Ecosystem account to continue building meaningful connections.',
    keywords: ['login', 'sign in', 'authentication']
  }),

  signup: generateSEO({
    title: 'Join The Ecosystem',
    description: 'Create your account and start connecting with professionals who share your values and goals.',
    keywords: ['signup', 'join', 'create account', 'registration']
  })
}

// Structured data for rich snippets
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Person', data: any) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseStructure,
        name: 'The Ecosystem × SAM AI',
        description: 'Intelligent professional networking platform',
        url: 'https://ecosystem-sam-ai.vercel.app',
        logo: 'https://ecosystem-sam-ai.vercel.app/logo.png',
        sameAs: [
          'https://twitter.com/ecosystem_sam_ai',
          'https://linkedin.com/company/ecosystem-sam-ai'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@ecosystem-sam-ai.com'
        }
      }

    case 'WebSite':
      return {
        ...baseStructure,
        name: 'The Ecosystem × SAM AI',
        url: 'https://ecosystem-sam-ai.vercel.app',
        description: 'Intelligent professional networking platform',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://ecosystem-sam-ai.vercel.app/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }

    case 'Person':
      return {
        ...baseStructure,
        ...data,
        url: `https://ecosystem-sam-ai.vercel.app/profile/${data.identifier}`,
        mainEntityOfPage: `https://ecosystem-sam-ai.vercel.app/profile/${data.identifier}`
      }

    default:
      return baseStructure
  }
}

// Meta tags for different pages
export function getPageMeta(page: keyof typeof pageSEO) {
  return pageSEO[page]
}

// Sitemap generation
export function generateSitemap(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>) {
  const baseUrl = 'https://ecosystem-sam-ai.vercel.app'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('')}
</urlset>`
}

// Robots.txt content
export const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /auth/callback

# Sitemap
Sitemap: https://ecosystem-sam-ai.vercel.app/sitemap.xml

# Crawl delay
Crawl-delay: 1`

// Performance optimization hints
export function generateResourceHints() {
  return {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.supabase.co'
    ],
    dnsPrefetch: [
      'https://huggingface.co',
      'https://api.openai.com'
    ]
  }
}

// Analytics and tracking
export function generateAnalyticsConfig() {
  return {
    googleAnalytics: {
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    },
    posthog: {
      apiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST
    }
  }
}
