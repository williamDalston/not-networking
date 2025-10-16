# Ecosystem × SAM AI

> **Not networking. Aligning.**

SAM AI learns who you are, what you need, and who complements you—then curates introductions that actually move your life and work forward.

## 🎯 Vision

Create *authentic human synergy* at scale—connections that compound into collaboration, learning, and impact. Optimize for **mutual outcomes and long-term relational health**, not clicks.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ecosystem-sam-ai.git
cd ecosystem-sam-ai

# Quick setup for new developers
make quick-start

# Or manual setup
make install
make env-setup
make db-setup
```

### Environment Setup

1. Copy the environment template:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `HUGGINGFACE_API_KEY` - For BGE embeddings
   - `OPENAI_API_KEY` - For narrative generation
   - `NEXT_PUBLIC_POSTHOG_KEY` - For analytics

### Development

```bash
# Start development server
make dev

# Run all checks
make check-all

# View available commands
make help
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL + pgvector)
- **AI/ML**: BGE-large-en-v1.5 embeddings, LambdaMART ranking
- **Analytics**: PostHog
- **Deployment**: Vercel

### Core Components

1. **SAM AI Matching System**
   - ANN-based candidate generation
   - Linear scoring with interpretable features
   - Linear Programming allocation
   - Serendipity module with MMR diversity

2. **Ecosystem Compact**
   - Built on curiosity, generosity, and thoughtful feedback
   - One-click commitment to community values

3. **Hybrid Events Engine**
   - Pre-event introductions
   - QR check-ins and proximity hints
   - Post-event follow-up automation

4. **Growth Circles**
   - 4-6 person peer groups
   - Formed by clustering and diversity constraints

## 📊 Metrics & Success Criteria

### Pilot Success Metrics
- **Helpful Rate ≥ 18%** - Matches that yield valuable outcomes
- **Sustained Match Rate ≥ 30%** - Matches with ≥2 replies or RSVP ≤14d
- **CDS Median ≥ 4.0** - Connection Depth Score
- **Event Conversion ≥ 25%** - RSVP to attendance rate
- **EHS ≥ 65** - Ecosystem Health Score

### Guardrails
- **Ghost Rate ≤ 35%** - No response rate
- **Fairness Gap ≤ 6pp** - Helpful rate delta across cohorts
- **Reciprocity Index ≥ 0.90** - Bidirectional engagement

## 🗄️ Database Schema

The application uses Supabase with PostgreSQL and pgvector for embeddings:

- `users` - User profiles and authentication
- `profiles` - Detailed SAM Discovery data
- `embeddings` - Vector embeddings for similarity search
- `matches` - Generated matches with explanations
- `feedback` - User feedback on matches
- `events` - Hybrid events with pre-intros
- `growth_circles` - Community peer groups

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## 🤖 SAM AI System

### Matching Pipeline

1. **Candidate Generation (ANN)**
   - Need→Strength similarity (40% of candidates)
   - Goal→Goal alignment (40% of candidates)
   - Values alignment (20% of candidates)

2. **Feature Engineering**
   - Cosine similarities
   - Reciprocity indicators
   - Readiness compatibility
   - Availability overlap
   - Location bonus
   - Reputation score
   - Novelty penalty

3. **Scoring & Ranking**
   - Linear scorer (v0)
   - LambdaMART (v1)
   - Cross-encoder re-rank (v2)

4. **Allocation**
   - Capacitated Linear Programming
   - Weekly caps (3 matches per user)
   - Serendipity module (15% exploration)

### Embeddings Strategy

- **Model**: BAAI/bge-large-en-v1.5 (768 dimensions)
- **Fields**: strengths, needs, goals, values (4 embeddings per user)
- **Normalization**: Unit vectors for cosine similarity
- **Fine-tuning**: Contrastive learning on pilot feedback

## 🎪 Events Engine

### Pre-Event
- SAM sends 3-5 priority introductions
- Contextual reasoning for each match
- Warm introduction templates

### During Event
- QR check-in unlocks attendee list
- Opt-in proximity hints
- "Met [Name]" one-tap logging

### Post-Event
- Recap prompts and missed introductions
- Feedback collection for model improvement
- Value flow visualization

## 📈 Health Dashboard

Real-time monitoring of:
- Helpful rate and ghost rate trends
- Ecosystem Health Score (EHS)
- Cohort diversity and balance
- Fairness metrics across demographics
- Coverage across domains and tags

Access at `/admin/health` (requires admin privileges).

## 🧪 Testing

```bash
# Run all tests
make test

# Run tests with coverage
make test-coverage

# Run tests in watch mode
make test-watch
```

## 🚀 Deployment

### Preview Deployments
Automatically deployed on pull requests to `develop` or `main`.

### Production Deployment
Automatically deployed on push to `main` branch.

### Manual Deployment
```bash
# Deploy preview
make deploy-preview

# Deploy production
make deploy-prod
```

## 📝 Development Workflow

### Making Changes

1. Create a feature branch from `develop`
2. Make your changes with tests
3. Run `make check-all` to ensure quality
4. Create a pull request
5. Address review feedback
6. Merge to `develop` for preview deployment
7. Merge to `main` for production deployment

### Database Changes

1. Create a new migration in `supabase/migrations/`
2. Test locally with `make db-reset`
3. Update TypeScript types with `make db-generate-types`
4. Include migration in your PR

### AI/ML Changes

1. Test embedding generation locally
2. Validate matching pipeline with sample data
3. Monitor metrics after deployment
4. Use A/B testing for model improvements

## 🔧 Configuration

### Environment Variables

See `env.example` for all required environment variables.

### Supabase Setup

1. Create a new Supabase project
2. Enable pgvector extension
3. Run migrations: `supabase db reset`
4. Set up Row Level Security policies
5. Configure authentication settings

### Analytics Setup

1. Create PostHog account
2. Add project key to environment
3. Configure custom events for matching

## 📚 API Documentation

### Authentication
- Supabase Auth with Row Level Security
- JWT tokens for API access
- User profiles and onboarding flow

### Matching API
- `POST /api/matches/generate` - Generate matches for user
- `GET /api/matches/:id` - Get match details with explanation
- `POST /api/feedback` - Submit match feedback

### Events API
- `GET /api/events` - List upcoming events
- `POST /api/events/:id/rsvp` - RSVP to event
- `POST /api/events/:id/checkin` - Check in to event

### Admin API
- `GET /api/admin/health` - Health metrics
- `POST /api/admin/run-matching` - Run matching pipeline
- `GET /api/admin/cohort-status` - Cohort analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all checks pass
6. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Document public APIs
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions
- **Email**: team@ecosystem-sam.ai

## 🎯 Roadmap

### Pilot Phase (12 weeks)
- [x] Core matching system
- [x] Hybrid events engine
- [x] Growth circles
- [x] Health dashboard
- [ ] Cohort management
- [ ] Mobile app (if retention >60%)

### V1 (Post-pilot)
- [ ] Contrastive fine-tuned embeddings
- [ ] Multilingual support
- [ ] SAM for Teams (B2B)
- [ ] Ecosystem API
- [ ] Advanced analytics

---

**Built with ❤️ by the Ecosystem team**
