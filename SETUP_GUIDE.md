# 🚀 Complete Setup Guide for The Ecosystem App

## ✅ What You Have Now
- **Working App**: https://not-networking-38qholt42-williamdalstons-projects.vercel.app
- **GitHub Repo**: https://github.com/williamDalston/not-networking
- **Database Schema**: Ready to deploy

## 🔑 Step 1: Get Your API Keys

### Supabase (Database & Auth)
1. Go to [supabase.com](https://supabase.com) → Sign up with GitHub
2. Create new project: `not-networking`
3. Go to Settings → API
4. Copy:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### OpenAI (AI Features)
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key: `not-networking-app`
3. Copy: `sk-...`
4. Add $5-10 credit to account

### Hugging Face (Embeddings)
1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create new token: `not-networking-embeddings`
3. Copy: `hf_...`

## 🗄️ Step 2: Set Up Database

1. Go to your Supabase project → **SQL Editor**
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click **Run**
4. Enable extensions: `uuid-ossp` and `vector`

## ⚙️ Step 3: Configure Vercel Environment Variables

Go to [vercel.com/dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Services
OPENAI_API_KEY=sk-...
HUGGINGFACE_API_KEY=hf_...

# Authentication
NEXTAUTH_SECRET=z8WsGdV4Hupkqoebg78RETVM7bAMIzYyPKy1/1GgonQ=
NEXTAUTH_URL=https://not-networking-38qholt42-williamdalstons-projects.vercel.app

# App Configuration
NEXT_PUBLIC_APP_URL=https://not-networking-38qholt42-williamdalstons-projects.vercel.app
NODE_ENV=production
```

## 🔄 Step 4: Redeploy

After adding environment variables:
1. Go to Vercel dashboard
2. Click **Redeploy** on your latest deployment
3. Wait for build to complete

## 🧪 Step 5: Test Your App

Once redeployed, test these features:
- ✅ Homepage loads
- ✅ User registration/login
- ✅ Profile creation
- ✅ AI matching
- ✅ Event management

## 💰 Cost Estimates (100 users/month)
- **Supabase**: $0-25 (free tier)
- **OpenAI**: $5-20 (depends on usage)
- **Hugging Face**: $0 (free tier)
- **Vercel**: $0-20 (free tier)
- **Total**: ~$5-65/month

## 🆘 Troubleshooting

### Build Errors
- Check all environment variables are set
- Verify API keys are correct
- Check Supabase project is active

### Database Issues
- Ensure extensions are enabled
- Check RLS policies are active
- Verify connection strings

### AI Features Not Working
- Check OpenAI API credit
- Verify Hugging Face token
- Check API rate limits

## 🎯 Next Steps

Once everything is working:
1. **Restore complex components** from backup
2. **Add custom domain** (optional)
3. **Set up monitoring** and analytics
4. **Invite beta users**

## 📞 Support

If you need help:
1. Check this guide
2. Review Vercel/Supabase logs
3. Test individual API endpoints
4. Contact support if needed

---

**🎉 You're building something amazing!** This networking platform has the potential to connect people in meaningful ways through AI-powered matching.
