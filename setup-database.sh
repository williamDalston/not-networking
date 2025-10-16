#!/bin/bash

echo "🚀 Setting up Supabase database for The Ecosystem app..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "📋 Database setup steps:"
echo ""
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy and paste the contents of supabase/migrations/001_initial_schema.sql"
echo "4. Click 'Run' to execute the schema"
echo ""
echo "🔧 Required extensions to enable:"
echo "   - uuid-ossp (for UUID generation)"
echo "   - vector (for AI embeddings)"
echo ""
echo "📊 After running the schema, you'll have:"
echo "   ✅ Users and profiles tables"
echo "   ✅ Embeddings table for AI matching"
echo "   ✅ Matches and events tables"
echo "   ✅ Row Level Security policies"
echo "   ✅ Proper indexes for performance"
echo ""
echo "🎯 Next: Set up your environment variables in Vercel!"
