# Ecosystem × SAM AI - Development Makefile
# Run `make help` to see all available commands

.PHONY: help install dev build start test lint format type-check db-setup db-reset db-seed clean

# Default target
help: ## Show this help message
	@echo "Ecosystem × SAM AI - Development Commands"
	@echo "========================================"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation and Setup
install: ## Install all dependencies
	npm install

setup: install db-setup ## Complete project setup (install + database)
	@echo "✅ Project setup complete!"
	@echo "Run 'make dev' to start development server"

# Development
dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm run start

# Testing and Quality
test: ## Run tests
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage
	npm run test:coverage

lint: ## Run ESLint
	npm run lint

format: ## Format code with Prettier
	npm run format

format-check: ## Check code formatting
	npm run format:check

type-check: ## Run TypeScript type checking
	npm run type-check

# Database Operations
db-setup: ## Initialize Supabase database
	supabase start
	supabase db reset
	@echo "✅ Database initialized"

db-reset: ## Reset database to clean state
	supabase db reset
	@echo "✅ Database reset"

db-seed: ## Seed database with sample data
	npm run db:seed
	@echo "✅ Database seeded"

db-generate-types: ## Generate TypeScript types from database
	npm run db:generate
	@echo "✅ Types generated"

db-stop: ## Stop Supabase services
	supabase stop
	@echo "✅ Supabase stopped"

# Environment Setup
env-setup: ## Copy environment file template
	cp env.example .env.local
	@echo "✅ Environment file created"
	@echo "⚠️  Please edit .env.local with your actual values"

# Health and Monitoring
health: ## Check application health
	@echo "Checking application health..."
	@curl -f http://localhost:3000/api/health || echo "❌ Health check failed"

metrics: ## Show current metrics (requires running app)
	@echo "Fetching current metrics..."
	@curl -s http://localhost:3000/api/metrics | jq '.' || echo "❌ Metrics endpoint not available"

# AI/ML Operations
generate-embeddings: ## Generate embeddings for all users (admin only)
	@echo "Generating embeddings..."
	@curl -X POST http://localhost:3000/api/admin/generate-embeddings || echo "❌ Embedding generation failed"

run-matching: ## Run matching pipeline for all users (admin only)
	@echo "Running matching pipeline..."
	@curl -X POST http://localhost:3000/api/admin/run-matching || echo "❌ Matching pipeline failed"

# Deployment
deploy-preview: ## Deploy preview to Vercel
	vercel --prod=false
	@echo "✅ Preview deployed"

deploy-prod: ## Deploy to production
	vercel --prod
	@echo "✅ Production deployed"

# Maintenance
clean: ## Clean build artifacts and node_modules
	rm -rf .next
	rm -rf node_modules
	rm -rf dist
	@echo "✅ Cleaned build artifacts"

clean-install: clean install ## Clean and reinstall everything
	@echo "✅ Clean install complete"

# Development Workflow
check-all: type-check lint format-check test ## Run all checks
	@echo "✅ All checks passed"

pre-commit: format lint type-check ## Run pre-commit checks
	@echo "✅ Pre-commit checks passed"

# Documentation
docs: ## Generate documentation
	@echo "📚 Documentation generation not yet implemented"

# Monitoring and Debugging
logs: ## Show application logs
	@echo "Showing application logs..."
	@tail -f .next/trace || echo "No logs available"

debug: ## Start debug mode
	DEBUG=* npm run dev

# Pilot-specific Commands
pilot-status: ## Show pilot status and metrics
	@echo "📊 Pilot Status:"
	@curl -s http://localhost:3000/api/pilot/status | jq '.' || echo "❌ Pilot status not available"

pilot-health-dashboard: ## Open health dashboard
	@echo "Opening health dashboard..."
	@open http://localhost:3000/admin/health || echo "❌ Health dashboard not available"

# Event Management
create-event: ## Create a new event (interactive)
	@echo "Creating new event..."
	@node scripts/create-event.js || echo "❌ Event creation failed"

# Cohort Management
cohort-status: ## Show cohort diversity and balance
	@echo "📈 Cohort Status:"
	@curl -s http://localhost:3000/api/cohort/status | jq '.' || echo "❌ Cohort status not available"

# Quick Development Commands
quick-start: env-setup install db-setup ## Quick start for new developers
	@echo "🚀 Quick start complete!"
	@echo "Run 'make dev' to start development server"

restart: db-reset dev ## Restart everything (database + dev server)
	@echo "🔄 Restart complete"

# Production Commands
prod-build: build ## Build for production
	@echo "🏗️  Production build complete"

prod-start: start ## Start production server
	@echo "🚀 Production server started"

# Backup and Restore
backup-db: ## Backup database
	supabase db dump --data-only > backup-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "✅ Database backed up"

# Security
security-scan: ## Run security scan
	npm audit
	@echo "🔒 Security scan complete"

# Performance
perf-test: ## Run performance tests
	@echo "⚡ Performance testing not yet implemented"

# Analytics
analytics: ## Show analytics dashboard
	@echo "📊 Opening analytics..."
	@open http://localhost:3000/admin/analytics || echo "❌ Analytics not available"
