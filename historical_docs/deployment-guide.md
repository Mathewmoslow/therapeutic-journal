# Secure Deployment Guide - AI Therapeutic Journal

## 🔐 Security Architecture Overview

Your therapeutic journal uses a **three-layer security model**:

1. **API Proxy Layer** - Vercel serverless functions handle all API calls
2. **Authentication Layer** - Supabase manages user auth and data isolation  
3. **Encryption Layer** - Client-side encryption for sensitive data

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│ Vercel Edge  │────▶│ Claude API  │
│   (React)   │◀────│  Functions   │◀────│  (Secured)  │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌─────────────┐     ┌──────────────┐
│  IndexedDB  │     │   Supabase   │
│ (Encrypted) │     │  (Auth + DB) │
└─────────────┘     └──────────────┘
```

## Step 1: Local Environment Setup

### 1.1 Create Secure Global Environment
```bash
# Create secure environment file
touch ~/.env.global
chmod 600 ~/.env.global

# Add your API keys (never commit these!)
cat >> ~/.env.global << 'EOF'
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
EOF
```

### 1.2 Update Shell Configuration
```bash
# Add to ~/.zshrc or ~/.bashrc
echo '
# Load secure environment variables
if [ -f ~/.env.global ]; then
  set -a
  source ~/.env.global
  set +a
fi
' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

### 1.3 Create Local Project Environment
```bash
# In your project directory
cat > .env.local << 'EOF'
# DO NOT COMMIT THIS FILE
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

# Add to .gitignore
echo ".env.local" >> .gitignore
echo ".env.global" >> .gitignore
```

## Step 2: Supabase Setup (Free Tier)

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project (free tier)
3. Save your project URL and keys

### 2.2 Database Schema
```sql
-- Users table (managed by Supabase Auth)

-- Entries table
CREATE TABLE entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  moment JSONB NOT NULL,
  initial_thoughts JSONB NOT NULL,
  tags TEXT[],
  encrypted_content TEXT,
  privacy_level TEXT DEFAULT 'private'
);

-- Reflections table
CREATE TABLE reflections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content JSONB NOT NULL,
  model_version TEXT,
  tokens_used INTEGER
);

-- Conversations table
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  thread JSONB NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checkpoints table
CREATE TABLE checkpoints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report JSONB NOT NULL,
  entry_ids UUID[]
);

-- Enable Row Level Security
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoints ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only see their own entries" ON entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own reflections" ON reflections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own checkpoints" ON checkpoints
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX idx_entries_tags ON entries USING GIN(tags);
CREATE INDEX idx_reflections_entry_id ON reflections(entry_id);
CREATE INDEX idx_conversations_entry_id ON conversations(entry_id);
CREATE INDEX idx_checkpoints_user_id ON checkpoints(user_id);
```

## Step 3: Vercel Deployment

### 3.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 3.2 Project Structure
```
therapeutic-journal/
├── api/
│   ├── claude.ts       # Claude API proxy
│   └── auth.ts         # Supabase auth proxy
├── src/
│   ├── components/
│   ├── services/
│   │   ├── therapeuticService.ts
│   │   └── storageService.ts
│   └── App.tsx
├── public/
├── .env.local          # Local only
├── .gitignore
├── package.json
├── tsconfig.json
└── vercel.json
```

### 3.3 Configure Vercel Environment Variables
```bash
# Add environment variables to Vercel (one time setup)
vercel env add ANTHROPIC_API_KEY production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add SUPABASE_ANON_KEY production

# For preview deployments
vercel env add ANTHROPIC_API_KEY preview
vercel env add SUPABASE_URL preview
vercel env add SUPABASE_SERVICE_KEY preview
vercel env add SUPABASE_ANON_KEY preview
```

### 3.4 Deploy
```bash
# Development deployment
vercel

# Production deployment
vercel --prod
```

## Step 4: Security Best Practices

### 4.1 API Key Rotation Schedule
```yaml
Monthly:
  - Rotate Supabase service keys
  - Update Vercel environment variables
  
Quarterly:
  - Rotate Anthropic API key
  - Audit API usage logs
  
On Breach:
  - Immediately rotate all keys
  - Review access logs
  - Notify affected users
```

### 4.2 Rate Limiting Configuration
```typescript
// api/claude.ts
const RATE_LIMITS = {
  free_tier: {
    requests_per_hour: 50,
    tokens_per_day: 100000
  },
  paid_tier: {
    requests_per_hour: 500,
    tokens_per_day: 1000000
  }
};
```

### 4.3 Data Privacy Compliance
```javascript
// Anonymization rules
const PRIVACY_RULES = {
  auto_anonymize: true,
  redact_patterns: [
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,  // Names
    /\b\d{3}-\d{3}-\d{4}\b/g,           // Phone
    /[\w.-]+@[\w.-]+\.\w+/g,            // Email
    /\b\d{3}-\d{2}-\d{4}\b/g            // SSN
  ],
  retention_days: 365,
  export_format: 'encrypted_json'
};
```

## Step 5: Monitoring & Maintenance

### 5.1 Set Up Monitoring
```javascript
// Vercel Analytics (automatic)
// Supabase Dashboard for DB metrics
// Custom logging for API usage

const monitoring = {
  track_api_usage: true,
  alert_thresholds: {
    error_rate: 0.01,      // 1%
    latency_p95: 3000,     // 3s
    token_usage: 0.8       // 80% of limit
  }
};
```

### 5.2 Backup Strategy
```bash
# Daily backup script
#!/bin/bash
# Run via GitHub Actions or cron

# Export Supabase data
supabase db dump -f backup_$(date +%Y%m%d).sql

# Encrypt backup
gpg --encrypt --recipient your@email.com backup_*.sql

# Upload to secure storage
aws s3 cp backup_*.sql.gpg s3://your-backup-bucket/
```

## Step 6: Cost Management (Free Tier Limits)

### Service Limits & Costs
| Service | Free Tier | Limits | Upgrade Path |
|---------|-----------|---------|--------------|
| **Vercel** | Hobby | 100GB bandwidth/mo, 100k fn calls | Pro: $20/mo |
| **Supabase** | Free | 500MB DB, 1GB storage, 50k MAUs | Pro: $25/mo |
| **Claude API** | None | Pay-per-use | ~$0.003/1k tokens |

### Cost Optimization
```javascript
// Cache reflections to reduce API calls
const CACHE_STRATEGY = {
  reflection_ttl: 86400 * 30,  // 30 days
  checkpoint_ttl: 86400 * 7,   // 7 days
  use_browser_cache: true,
  use_supabase_cache: true
};

// Batch processing for checkpoints
const BATCH_CONFIG = {
  min_entries_for_checkpoint: 5,
  max_checkpoint_frequency: 'weekly',
  combine_similar_patterns: true
};
```

## Step 7: Testing Checklist

### Pre-Deployment Tests
```bash
# Security Tests
✓ API keys not exposed in frontend bundle
✓ All API calls go through proxy
✓ Rate limiting works
✓ Auth required for all data access
✓ RLS policies enforced

# Functionality Tests
✓ Entry creation and encryption
✓ AI reflection generation (8000+ tokens)
✓ Conversation continuity
✓ Checkpoint generation
✓ Data export

# Performance Tests
✓ Entry save < 3s
✓ Reflection generation < 10s
✓ Page load < 2s
✓ Smooth UI interactions
```

### Deployment Verification
```bash
# Check deployment
curl https://your-app.vercel.app/api/health

# Verify environment variables
vercel env ls

# Check logs
vercel logs --follow

# Monitor function usage
vercel inspect
```

## Step 8: Launch Sequence

### 8.1 Soft Launch (Alpha)
```
Week 1-2:
- Deploy to Vercel preview
- Test with 3-5 trusted users
- Monitor API usage and costs
- Fix critical bugs

Week 3-4:
- Implement user feedback
- Optimize token usage
- Add error recovery
- Prepare documentation
```

### 8.2 Beta Launch
```
Month 2:
- Open registration (limited)
- Add usage analytics
- Implement feedback widget
- Monitor scaling needs
```

### 8.3 Production Launch
```
Month 3:
- Full public launch
- Marketing website
- Support documentation
- Premium tier planning
```

## Troubleshooting

### Common Issues & Solutions

**Issue: "API key not found"**
```bash
# Verify environment variables
vercel env pull
cat .env.local

# Re-add if missing
vercel env add ANTHROPIC_API_KEY
```

**Issue: "Rate limit exceeded"**
```javascript
// Implement exponential backoff
const retry = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status === 429) {
      await new Promise(r => setTimeout(r, 2 ** (3 - retries) * 1000));
      return retry(fn, retries - 1);
    }
    throw error;
  }
};
```

**Issue: "CORS errors"**
```javascript
// Update api/claude.ts headers
res.setHeader('Access-Control-Allow-Origin', 
  process.env.NODE_ENV === 'production' 
    ? 'https://your-app.vercel.app'
    : '*'
);
```

## Security Incident Response

### If API Keys Are Compromised:
1. **Immediate:** Rotate all keys via provider dashboards
2. **Within 1 hour:** Update Vercel environment variables
3. **Within 24 hours:** Audit logs for unauthorized usage
4. **Within 48 hours:** Notify affected users if data accessed
5. **Within 1 week:** Post-mortem and process improvement

## Support & Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Anthropic API:** [docs.anthropic.com](https://docs.anthropic.com)
- **Security:** OWASP guidelines for web applications
- **Privacy:** GDPR/CCPA compliance frameworks

## Final Checklist

Before going live:
- [ ] All API keys secured in environment variables
- [ ] Database RLS policies tested
- [ ] Rate limiting implemented and tested
- [ ] Encryption working for sensitive data
- [ ] Backup system configured
- [ ] Monitoring alerts set up
- [ ] Privacy policy and ToS ready
- [ ] Support email configured
- [ ] Cost alerts configured
- [ ] Security headers implemented

---

**Remember:** Your therapeutic journal handles sensitive mental health data. Security isn't optional—it's essential for user trust and legal compliance.