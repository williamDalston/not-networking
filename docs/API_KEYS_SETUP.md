# API Keys Setup Guide

This guide will walk you through setting up all the required API keys for The Ecosystem × SAM AI platform.

## 🔑 Required API Keys

### 1. Supabase (Database & Authentication)

**Purpose:** User authentication, database storage, and real-time features

**Setup Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important:** 
- Keep the Service Role Key secret (server-side only)
- The Anon Key is safe for client-side use
- Enable Row Level Security (RLS) on all tables

---

### 2. Hugging Face (AI Embeddings)

**Purpose:** Generate embeddings for user profiles using BGE-large-en-v1.5 model

**Setup Steps:**
1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new token with `read` access
3. Copy the token:

```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Model Used:** `BAAI/bge-large-en-v1.5`
- **Dimensions:** 768
- **Max Tokens:** 512
- **Cost:** Free tier available

---

### 3. OpenAI (Audio & Text Processing)

**Purpose:** Whisper audio transcription and narrative generation

**Setup Steps:**
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy the key:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Models Used:**
- **Whisper-1:** Audio transcription
- **GPT-4-turbo-mini:** Narrative generation
- **GPT-4o-mini:** Text completion

**Cost Estimate:** ~$0.01-0.05 per user onboarding

---

### 4. PostHog (Analytics)

**Purpose:** User behavior tracking and product analytics

**Setup Steps:**
1. Go to [PostHog Dashboard](https://app.posthog.com)
2. Create a new project
3. Go to Project Settings → API Keys
4. Copy the Project API Key:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Features Used:**
- User event tracking
- Feature flags
- A/B testing
- Conversion funnels

---

### 5. NextAuth Secret

**Purpose:** Session encryption and JWT signing

**Setup Steps:**
1. Generate a secure random string:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

2. Copy the generated string:

```env
NEXTAUTH_SECRET=your-generated-secret-key-here
```

**⚠️ Important:** This must be a secure random string of at least 32 characters.

---

## 🚀 Deployment Setup

### For Vercel Deployment:

1. **Connect your GitHub repository to Vercel**
2. **Go to Project Settings → Environment Variables**
3. **Add all the environment variables:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# AI Services
HUGGINGFACE_API_KEY=your-key
OPENAI_API_KEY=your-key

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### For Local Development:

1. **Copy the example file:**
```bash
cp env.production.example .env.local
```

2. **Fill in your actual values in `.env.local`**

3. **Start the development server:**
```bash
npm run dev
```

---

## 🧪 Testing Your Setup

### 1. Test Supabase Connection
```bash
curl -X GET "https://your-project.supabase.co/rest/v1/profiles?select=*" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

### 2. Test Hugging Face API
```bash
curl -X POST "https://api-inference.huggingface.co/models/BAAI/bge-large-en-v1.5" \
  -H "Authorization: Bearer your-huggingface-key" \
  -H "Content-Type: application/json" \
  -d '{"inputs": "test text"}'
```

### 3. Test OpenAI API
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer your-openai-key"
```

### 4. Test PostHog Connection
Visit your deployed app and check the browser console for PostHog initialization messages.

---

## 🔧 Troubleshooting

### Common Issues:

**1. "Invalid API Key" Errors**
- Double-check the key format (no extra spaces/newlines)
- Ensure the key has the correct permissions
- Verify you're using the right environment (dev vs prod)

**2. Supabase RLS Errors**
- Make sure Row Level Security is enabled
- Check that your RLS policies are correctly configured
- Verify the user is authenticated before making requests

**3. Embedding Generation Fails**
- Check Hugging Face API quota/rate limits
- Verify the model is loaded (first request may take longer)
- Ensure input text is within token limits (512 tokens max)

**4. Audio Transcription Issues**
- Verify OpenAI API key has Whisper access
- Check audio file format (WebM, MP3, WAV supported)
- Ensure file size is under 25MB limit

---

## 💰 Cost Estimates

### Monthly Costs (100 active users):

- **Supabase:** $0-25 (free tier covers most usage)
- **Hugging Face:** $0 (free tier sufficient)
- **OpenAI:** $5-20 (depends on audio usage)
- **PostHog:** $0-20 (free tier available)
- **Vercel:** $0-20 (free tier covers most usage)

**Total:** ~$5-65/month for 100 users

---

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use different keys for development and production**
3. **Regularly rotate API keys**
4. **Monitor API usage and set up alerts**
5. **Use environment-specific configurations**
6. **Enable API key restrictions where possible**

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Test individual API endpoints
4. Check service status pages:
   - [Supabase Status](https://status.supabase.com)
   - [OpenAI Status](https://status.openai.com)
   - [Hugging Face Status](https://status.huggingface.co)

For additional help, refer to the official documentation of each service or contact support.
