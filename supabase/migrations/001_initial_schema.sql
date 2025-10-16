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
    work_style JSONB, -- {preferred_communication, collaboration_style, etc.}
    weekly_availability INTEGER DEFAULT 5, -- hours per week
    readiness_level INTEGER CHECK (readiness_level >= 1 AND readiness_level <= 10),
    
    -- Confidence levels (weights for matching)
    confidence_weights JSONB DEFAULT '{}',
    
    -- Preferences
    matching_preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Embeddings for vector similarity search
CREATE TABLE public.embeddings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    field_type TEXT NOT NULL CHECK (field_type IN ('strengths', 'needs', 'goals', 'values')),
    embedding vector(768), -- BGE-large-en-v1.5 dimension
    text_content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, field_type)
);

-- User signals for learning
CREATE TABLE public.signals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    signal_type TEXT NOT NULL,
    signal_data JSONB NOT NULL,
    strength FLOAT DEFAULT 1.0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches between users
CREATE TABLE public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_a_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    user_b_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Match metadata
    match_score FLOAT NOT NULL,
    match_type TEXT NOT NULL, -- 'need_strength', 'goal_alignment', 'serendipity', etc.
    explanation_data JSONB,
    raw_features JSONB, -- For model interpretability
    
    -- Allocation info
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    allocation_week DATE NOT NULL, -- For weekly caps
    
    -- Status tracking
    status match_status DEFAULT 'pending',
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_a_id, user_b_id, allocation_week)
);

-- User interactions and feedback
CREATE TABLE public.interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    other_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    interaction_type interaction_type NOT NULL,
    content TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback on matches
CREATE TABLE public.feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    other_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    rating feedback_rating NOT NULL,
    ordinal_score INTEGER CHECK (ordinal_score >= 1 AND ordinal_score <= 5),
    feedback_text TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(match_id, user_id)
);

-- Events for hybrid engine
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL,
    location TEXT,
    virtual_url TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    
    -- Event configuration
    max_attendees INTEGER,
    requires_rsvp BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,
    status event_status DEFAULT 'draft',
    
    -- SAM pre-intro configuration
    pre_intro_count INTEGER DEFAULT 3,
    pre_intro_sent_at TIMESTAMPTZ,
    
    -- Metadata
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE public.rsvps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    status TEXT NOT NULL CHECK (status IN ('attending', 'not_attending', 'maybe')),
    checked_in_at TIMESTAMPTZ,
    qr_code TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- Event interactions (who met whom)
CREATE TABLE public.event_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_a_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    user_b_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('met', 'introduced', 'collaborated')),
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(event_id, user_a_id, user_b_id)
);

-- Growth Circles for community building
CREATE TABLE public.growth_circles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    max_members INTEGER DEFAULT 6,
    theme TEXT,
    
    status TEXT DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed', 'dissolved')),
    start_date DATE,
    end_date DATE,
    
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Growth Circle memberships
CREATE TABLE public.growth_circle_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    circle_id UUID REFERENCES public.growth_circles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'facilitator')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(circle_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_location ON public.users(location);
CREATE INDEX idx_users_last_active ON public.users(last_active_at);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_strengths ON public.profiles USING GIN(strengths);
CREATE INDEX idx_profiles_needs ON public.profiles USING GIN(needs);
CREATE INDEX idx_profiles_goals ON public.profiles USING GIN(goals);
CREATE INDEX idx_profiles_values ON public.profiles USING GIN(values);

-- Vector similarity indexes using HNSW
CREATE INDEX idx_embeddings_strengths ON public.embeddings USING hnsw (embedding vector_cosine_ops) WHERE field_type = 'strengths';
CREATE INDEX idx_embeddings_needs ON public.embeddings USING hnsw (embedding vector_cosine_ops) WHERE field_type = 'needs';
CREATE INDEX idx_embeddings_goals ON public.embeddings USING hnsw (embedding vector_cosine_ops) WHERE field_type = 'goals';
CREATE INDEX idx_embeddings_values ON public.embeddings USING hnsw (embedding vector_cosine_ops) WHERE field_type = 'values';

CREATE INDEX idx_signals_user_id ON public.signals(user_id);
CREATE INDEX idx_signals_type ON public.signals(signal_type);
CREATE INDEX idx_signals_expires ON public.signals(expires_at);

CREATE INDEX idx_matches_user_a ON public.matches(user_a_id);
CREATE INDEX idx_matches_user_b ON public.matches(user_b_id);
CREATE INDEX idx_matches_allocation_week ON public.matches(allocation_week);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_score ON public.matches(match_score);

CREATE INDEX idx_interactions_match_id ON public.interactions(match_id);
CREATE INDEX idx_interactions_user_id ON public.interactions(user_id);
CREATE INDEX idx_interactions_type ON public.interactions(interaction_type);

CREATE INDEX idx_feedback_match_id ON public.feedback(match_id);
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX idx_feedback_rating ON public.feedback(rating);

CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_created_by ON public.events(created_by);

CREATE INDEX idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX idx_rsvps_user_id ON public.rsvps(user_id);
CREATE INDEX idx_rsvps_status ON public.rsvps(status);

CREATE INDEX idx_event_interactions_event_id ON public.event_interactions(event_id);
CREATE INDEX idx_event_interactions_users ON public.event_interactions(user_a_id, user_b_id);

-- Create materialized view for fast ANN retrieval
CREATE MATERIALIZED VIEW mv_user_ann AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.avatar_url,
    u.role,
    u.location,
    u.timezone,
    u.is_onboarded,
    u.last_active_at,
    p.strengths,
    p.needs,
    p.goals,
    p.values,
    p.work_style,
    p.weekly_availability,
    p.readiness_level,
    p.confidence_weights,
    e_strengths.embedding as strengths_embedding,
    e_needs.embedding as needs_embedding,
    e_goals.embedding as goals_embedding,
    e_values.embedding as values_embedding
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
LEFT JOIN public.embeddings e_strengths ON u.id = e_strengths.user_id AND e_strengths.field_type = 'strengths'
LEFT JOIN public.embeddings e_needs ON u.id = e_needs.user_id AND e_needs.field_type = 'needs'
LEFT JOIN public.embeddings e_goals ON u.id = e_goals.user_id AND e_goals.field_type = 'goals'
LEFT JOIN public.embeddings e_values ON u.id = e_values.user_id AND e_values.field_type = 'values'
WHERE u.is_active = TRUE AND u.is_onboarded = TRUE;

-- Create index on materialized view
CREATE INDEX idx_mv_user_ann_location ON mv_user_ann(location);
CREATE INDEX idx_mv_user_ann_role ON mv_user_ann(role);
CREATE INDEX idx_mv_user_ann_strengths ON mv_user_ann USING GIN(strengths);
CREATE INDEX idx_mv_user_ann_needs ON mv_user_ann USING GIN(needs);

-- Create views for operations and analytics
CREATE VIEW v_helpful_rate AS
SELECT 
    DATE_TRUNC('week', m.created_at) as week,
    COUNT(*) as total_matches,
    COUNT(f.id) as feedback_count,
    COUNT(CASE WHEN f.rating IN ('collaboration', 'insight', 'good_chat') THEN 1 END) as helpful_count,
    ROUND(
        COUNT(CASE WHEN f.rating IN ('collaboration', 'insight', 'good_chat') THEN 1 END)::FLOAT / 
        NULLIF(COUNT(f.id), 0) * 100, 2
    ) as helpful_rate_percent
FROM public.matches m
LEFT JOIN public.feedback f ON m.id = f.match_id
GROUP BY DATE_TRUNC('week', m.created_at)
ORDER BY week DESC;

CREATE VIEW v_ghost_rate AS
SELECT 
    DATE_TRUNC('week', m.created_at) as week,
    COUNT(*) as total_matches,
    COUNT(CASE WHEN f.rating = 'no_response' THEN 1 END) as ghost_count,
    ROUND(
        COUNT(CASE WHEN f.rating = 'no_response' THEN 1 END)::FLOAT / 
        NULLIF(COUNT(f.id), 0) * 100, 2
    ) as ghost_rate_percent
FROM public.matches m
LEFT JOIN public.feedback f ON m.id = f.match_id
GROUP BY DATE_TRUNC('week', m.created_at)
ORDER BY week DESC;

CREATE VIEW v_coverage_diversity AS
SELECT 
    tag,
    COUNT(DISTINCT u.id) as user_count,
    ROUND(COUNT(DISTINCT u.id)::FLOAT / (SELECT COUNT(*) FROM public.users WHERE is_active = TRUE) * 100, 2) as coverage_percent
FROM public.users u
JOIN public.profiles p ON u.id = p.user_id,
LATERAL UNNEST(p.strengths || p.needs || p.goals || p.values) as tag
WHERE u.is_active = TRUE
GROUP BY tag
ORDER BY user_count DESC;

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_embeddings_updated_at BEFORE UPDATE ON public.embeddings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_signals_updated_at BEFORE UPDATE ON public.signals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_growth_circles_updated_at BEFORE UPDATE ON public.growth_circles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_user_ann_view()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_ann;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_circle_members ENABLE ROW LEVEL SECURITY;

-- Users can read their own data and basic info of others
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Profiles are readable by all active users
CREATE POLICY "Active users can view profiles" ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND is_active = TRUE)
);

-- Users can only manage their own profile
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id);

-- Embeddings are private to the user
CREATE POLICY "Users can manage own embeddings" ON public.embeddings FOR ALL USING (auth.uid() = user_id);

-- Signals are private to the user
CREATE POLICY "Users can manage own signals" ON public.signals FOR ALL USING (auth.uid() = user_id);

-- Matches are visible to both participants
CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT USING (
    auth.uid() = user_a_id OR auth.uid() = user_b_id
);

-- Interactions are visible to both participants
CREATE POLICY "Users can view own interactions" ON public.interactions FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = other_user_id
);

CREATE POLICY "Users can create own interactions" ON public.interactions FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

-- Feedback is visible to both participants
CREATE POLICY "Users can view own feedback" ON public.feedback FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = other_user_id
);

CREATE POLICY "Users can create own feedback" ON public.feedback FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own feedback" ON public.feedback FOR UPDATE USING (
    auth.uid() = user_id
);

-- Events are readable by all active users
CREATE POLICY "Active users can view events" ON public.events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_active = TRUE)
);

-- RSVPs are visible to event organizers and the user
CREATE POLICY "Users can view own rsvps" ON public.rsvps FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND created_by = auth.uid())
);

CREATE POLICY "Users can manage own rsvps" ON public.rsvps FOR ALL USING (auth.uid() = user_id);

-- Event interactions are visible to participants
CREATE POLICY "Users can view own event interactions" ON public.event_interactions FOR SELECT USING (
    auth.uid() = user_a_id OR auth.uid() = user_b_id
);

CREATE POLICY "Users can create own event interactions" ON public.event_interactions FOR INSERT WITH CHECK (
    auth.uid() = user_a_id
);

-- Growth circles are readable by members
CREATE POLICY "Members can view growth circles" ON public.growth_circles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.growth_circle_members WHERE circle_id = id AND user_id = auth.uid())
);

-- Growth circle memberships are visible to members
CREATE POLICY "Members can view circle memberships" ON public.growth_circle_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.growth_circle_members gcm2 WHERE gcm2.circle_id = circle_id AND gcm2.user_id = auth.uid())
);
