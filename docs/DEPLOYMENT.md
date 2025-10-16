# Deployment Guide: The Ecosystem × SAM AI

This guide walks you through deploying The Ecosystem × SAM AI to Vercel with all necessary configurations.

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository** - Code pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project** - Set up at [supabase.com](https://supabase.com)
4. **API Keys** - All required API keys (see [API_KEYS_SETUP.md](./API_KEYS_SETUP.md))

## Quick Start

### 1. Environment Variables Setup

First, obtain all required API keys:

```bash
# Check what environment variables you need
npm run check-env:template
```

Create a `.env.local` file with all required variables:

```bash
# Copy the template
npm run check-env:template > .env.local

# Edit the file with your actual API keys
```

### 2. Database Setup

```bash
# Run database migrations
npx supabase db push

# Seed the database with sample data
npm run db:seed
```

### 3. Local Testing

```bash
# Install dependencies
npm install

# Check environment variables
npm run check-env

# Run development server
npm run dev

# Run smoke tests
npm run smoke-test
```

### 4. Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   HUGGINGFACE_API_KEY=your-huggingface-key
   OPENAI_API_KEY=your-openai-key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   NEXT_PUBLIC_POSTHOG_API_KEY=your-posthog-key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Test your deployment

## Detailed Setup

### Supabase Configuration

1. **Create Project**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link to your project
   supabase link --project-ref your-project-ref
   ```

2. **Run Migrations**
   ```bash
   # Push schema to production
   supabase db push

   # Verify schema
   supabase db diff
   ```

3. **Enable Extensions**
   - Go to Supabase Dashboard → Database → Extensions
   - Enable `pgvector` extension
   - Enable `uuid-ossp` extension

### API Keys Setup

#### 1. Supabase
- **Project URL**: Found in Project Settings → API
- **Anon Key**: Found in Project Settings → API
- **Service Role Key**: Found in Project Settings → API (keep secret!)

#### 2. Hugging Face
- Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
- Create new token with `read` access
- Used for BGE embeddings

#### 3. OpenAI
- Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
- Create new secret key
- Used for Whisper and narrative generation

#### 4. PostHog (Optional)
- Go to [PostHog Project Settings](https://app.posthog.com/project/settings)
- Copy Project API Key
- Used for analytics

### Vercel Configuration

#### Build Settings
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

#### Environment Variables
Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ✅ |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog instance host | ❌ |
| `NEXT_PUBLIC_POSTHOG_API_KEY` | PostHog project key | ❌ |

#### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Post-Deployment

### 1. Run Smoke Tests

```bash
# Test your deployed application
npm run smoke-test https://your-app.vercel.app
```

### 2. Verify Database Connection

```bash
# Check if database is accessible
curl https://your-app.vercel.app/api/admin/ai-health
```

### 3. Test Critical Flows

1. **User Registration**
   - Go to `/auth/signup`
   - Create a new account
   - Verify email confirmation

2. **Onboarding**
   - Complete the onboarding flow
   - Verify profile creation

3. **Dashboard**
   - Check if matches are generated
   - Verify all components load

4. **Mobile Experience**
   - Test on mobile devices
   - Verify responsive design

### 4. Monitor Performance

- Check Vercel Analytics
- Monitor Supabase usage
- Watch for error logs

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel
# Common causes:
# - Missing environment variables
# - TypeScript errors
# - Import issues
```

#### Database Connection Issues
```bash
# Verify Supabase URL and keys
# Check RLS policies
# Ensure pgvector extension is enabled
```

#### API Rate Limits
```bash
# Check Hugging Face API usage
# Monitor OpenAI API limits
# Implement request queuing if needed
```

### Debug Commands

```bash
# Check environment variables
npm run check-env

# Run local build
npm run build

# Test locally
npm run smoke-test

# Check database
npx supabase db diff
```

## Security Checklist

- [ ] All environment variables set in Vercel
- [ ] Service role key kept secret
- [ ] RLS policies enabled in Supabase
- [ ] CORS configured properly
- [ ] API rate limits implemented
- [ ] Error messages don't leak sensitive info

## Performance Optimization

### Build Optimization
- Enable Vercel Analytics
- Use Next.js Image Optimization
- Implement proper caching headers

### Database Optimization
- Add proper indexes
- Monitor query performance
- Use connection pooling

### API Optimization
- Implement request caching
- Use batch processing for embeddings
- Monitor API usage and costs

## Monitoring & Maintenance

### Health Checks
- Set up uptime monitoring
- Monitor error rates
- Track performance metrics

### Regular Maintenance
- Update dependencies monthly
- Monitor API usage
- Review and rotate API keys
- Backup database regularly

### Scaling Considerations
- Monitor user growth
- Plan for increased API usage
- Consider CDN for static assets
- Implement proper caching strategies

## Support

If you encounter issues:

1. Check the [API Keys Setup Guide](./API_KEYS_SETUP.md)
2. Run smoke tests to identify issues
3. Check Vercel and Supabase logs
4. Review this deployment guide

## Success Criteria

Your deployment is successful when:

- [ ] All smoke tests pass
- [ ] Users can sign up and complete onboarding
- [ ] Matches are generated correctly
- [ ] All pages load without errors
- [ ] Mobile experience is smooth
- [ ] Database queries are fast (< 500ms)
- [ ] API responses are reliable

---

**🎉 Congratulations!** You've successfully deployed The Ecosystem × SAM AI. The platform is now ready for users to start making meaningful connections.
