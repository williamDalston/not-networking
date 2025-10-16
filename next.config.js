/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { 
    ignoreBuildErrors: false 
  },
  eslint: {
    ignoreDuringBuilds: false
  },
  serverExternalPackages: ['@supabase/supabase-js']
}

module.exports = nextConfig