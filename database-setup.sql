-- =============================================
-- The Ecosystem App Database Schema
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create custom types
CREATE TYPE user_role AS ENUM ('giver', 'seeker', 'both');
CREATE TYPE interaction_type AS ENUM ('connect', 'message', 'rsvp', 'feedback');
CREATE TYPE feedback_rating AS ENUM ('collaboration', 'insight', 'good_chat', 'didnt_click', 'no_response');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'ongoing', 'completed', 'cancelled');
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'both',
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    is_onboarded BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- User profiles with detailed information
CREATE TABLE public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Core identity
    bio TEXT,
    headline TEXT,
    website TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    
    -- SAM Discovery fields
    strengths TEXT[],
    needs TEXT[],
    goals TEXT[],
    values TEXT[],
    
    -- Work style and availability
    work_style JSONB,
    weekly_availability INTEGER DEFAULT 5,
    readiness_level INTEGER CHECK (readiness_level >= 1 AND readiness_level <= 10),
    
    -- Onboarding progress
    onboarding_step INTEGER DEFAULT 0,
    onboarding_responses JSONB,
    is_onboarded BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Embeddings table for AI matching
CREATE TABLE public.embeddings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    field_type TEXT NOT NULL CHECK (field_type IN ('strengths', 'needs', 'goals', 'values')),
    text_content TEXT NOT NULL,
    embedding vector(768), -- BGE-large-en-v1.5 dimensions
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, field_type)
);

-- Matches table
CREATE TABLE public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    match_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,
    match_type TEXT NOT NULL,
    features JSONB,
    explanation TEXT,
    status match_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, match_user_id)
);

-- Events table
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    max_attendees INTEGER,
    status event_status DEFAULT 'draft',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE public.event_rsvps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- Feedback table
CREATE TABLE public.feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    interaction_type interaction_type NOT NULL,
    rating feedback_rating NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_embeddings_user_id ON public.embeddings(user_id);
CREATE INDEX idx_embeddings_field_type ON public.embeddings(field_type);
CREATE INDEX idx_matches_user_id ON public.matches(user_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_event_rsvps_event_id ON public.event_rsvps(event_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own data and public profiles
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Embeddings policies
CREATE POLICY "Users can manage own embeddings" ON public.embeddings
    FOR ALL USING (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON public.matches
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = match_user_id);

CREATE POLICY "Users can update own matches" ON public.matches
    FOR UPDATE USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Users can view published events" ON public.events
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Event RSVPs policies
CREATE POLICY "Users can manage own RSVPs" ON public.event_rsvps
    FOR ALL USING (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can create feedback" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can view feedback about them" ON public.feedback
    FOR SELECT USING (auth.uid() = to_user_id);

-- =============================================
-- Schema setup complete!
-- =============================================
