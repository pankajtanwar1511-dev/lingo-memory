# Development Roadmap

**Last Updated:** October 28, 2024
**Current Status:** 60% Production Ready

---

## Current Status Summary

### ✅ Completed

**Foundation (Phase 1)**
- [x] Next.js 14 project setup with TypeScript
- [x] Tailwind CSS with custom theme
- [x] Radix UI component library integrated
- [x] Landing page and core pages
- [x] PWA manifest and configuration
- [x] Dark mode support

**Core Features**
- [x] Flashcard study system with FSRS algorithm
- [x] Vocabulary browser with search/filter
- [x] Quiz mode with multiple question types
- [x] Progress tracking
- [x] Analytics dashboard
- [x] Settings management

**Data Management**
- [x] IndexedDB with Dexie
- [x] Seed data loading system
- [x] Import/export functionality
- [x] Quality validation system
- [x] Data fetching with filters (JMdict/Tatoeba)
- [x] AI verification system (39 batches completed)

**Data Quality**
- [x] N5 dataset: 401/662 verified (60.6%)
- [ ] N5 dataset: 261/662 need AI generation (39.4%)
- [ ] N4 dataset: Not started
- [x] Legal attribution system

**Services (14 total)**
- [x] Database service
- [x] Seed loader service
- [x] Content import service
- [x] Sentence matcher service
- [x] Quality scorer service
- [x] Audio generator service
- [x] Analytics service
- [x] Sync service (coded, not activated)
- [x] Auth service (coded, not activated)
- [x] Settings service

**Documentation**
- [x] 8 consolidated guides
- [x] 49 archived historical docs
- [x] Complete schema documentation
- [x] Pipeline execution guides

### 🚧 In Progress

**N5 Dataset Completion**
- [x] 401/662 words verified (60.6%)
- [ ] Generate examples for remaining 261 words using AI
- [ ] Verify AI-generated content
- [ ] Integrate all 662 words into app

**N4 Dataset**
- [ ] Not started - planned after N5 completion

**Audio Production**
- [ ] Removed previous TTS experiments (licensing)
- [ ] Plan: Use licensed LLM-based TTS in future
- [ ] Generate for 401 verified words first
- [ ] Add audio for remaining words later

### ❌ Not Yet Implemented

**Phase 2: Core Activation**
- [ ] Firebase authentication activation
- [ ] Cloud sync with Firestore
- [ ] User registration/login flow
- [ ] Password reset functionality

**Testing**
- [ ] Unit tests for services
- [ ] Integration tests for pipeline
- [ ] E2E tests for critical flows
- [ ] Test coverage reporting

**Phase 3: Premium Features**
- [ ] Stripe payment integration
- [ ] Premium audio quality
- [ ] Advanced analytics
- [ ] Ad-free experience

---

## Roadmap by Priority

### 🔥 Critical (Before Launch)

**1. Complete N5 Dataset** (Est: 6-10 hours)
- [ ] Generate examples for remaining 261 N5 words using AI
- [ ] Verify AI-generated examples (manual review)
- [ ] Integrate all 662 words into production dataset
- [ ] Update app to use complete dataset

**2. Firebase Activation** (Est: 2-3 hours)
- [ ] Set up Firebase project
- [ ] Configure authentication
- [ ] Set up Firestore security rules
- [ ] Test signup/login flow
- [ ] Enable email verification

**3. Testing Suite** (Est: 8-12 hours)
- [ ] Set up Jest + React Testing Library
- [ ] Write unit tests for critical services
- [ ] Add integration tests for database operations
- [ ] E2E tests for study flow
- [ ] Achieve 60%+ coverage

### 📈 High Priority (Post-Launch)

**4. Audio Generation** (Est: 4-8 hours)
- [ ] Choose licensed TTS solution (LLM-based)
- [ ] Generate audio for 401 verified N5 words
- [ ] Test quality and pronunciation
- [ ] Upload to CDN
- [ ] Integrate into app

**5. N4 Dataset Creation** (Est: 8-12 hours)
- [ ] Fetch N4 data from JMdict/Tatoeba
- [ ] Apply filters
- [ ] AI verification
- [ ] Generate missing examples
- [ ] Target: Similar 60%+ verified rate as N5

**6. Performance Optimization** (Est: 4-6 hours)
- [ ] Code splitting optimization
- [ ] Image optimization (Next.js Image)
- [ ] Bundle size analysis
- [ ] Lazy loading for heavy components
- [ ] Service worker for offline caching

**7. Cloud Sync Implementation** (Est: 6-8 hours)
- [ ] Firestore schema design
- [ ] Sync up/down logic
- [ ] Conflict resolution
- [ ] Offline queue
- [ ] Progress indicator

**8. Analytics Dashboard** (Est: 4-6 hours)
- [ ] Study time charts (Recharts)
- [ ] Accuracy trends
- [ ] Streak tracking
- [ ] FSRS predictions visualization
- [ ] Export reports (PDF/CSV)

### 🎯 Medium Priority (1-2 months)

**9. N3 Dataset Creation** (Est: 4-6 hours)
- [ ] Download N3 vocabulary list
- [ ] Run 7-phase pipeline
- [ ] Achieve 95%+ coverage
- [ ] Generate audio
- [ ] Integrate into app

**10. Premium Features Foundation** (Est: 8-12 hours)
- [ ] Stripe account setup
- [ ] Payment flow design
- [ ] Subscription management
- [ ] Premium tier definition
- [ ] Billing page

**11. Mobile Responsiveness** (Est: 4-6 hours)
- [ ] Audit mobile UX
- [ ] Fix layout issues
- [ ] Touch gesture optimization
- [ ] iOS/Android testing
- [ ] PWA install prompts

**12. SEO & Marketing** (Est: 6-8 hours)
- [ ] Meta tags optimization
- [ ] sitemap.xml generation
- [ ] robots.txt configuration
- [ ] Open Graph images
- [ ] Blog/content pages

### 🌟 Future Enhancements (3-6 months)

**13. Community Features**
- [ ] User-created decks
- [ ] Deck sharing
- [ ] Collaborative learning
- [ ] Comments and ratings
- [ ] Leaderboards

**14. Advanced Learning Features**
- [ ] Speech recognition practice
- [ ] Sentence construction exercises
- [ ] Kanji recognition mode
- [ ] Listening comprehension
- [ ] Reading passages

**15. N2 & N1 Datasets**
- [ ] N2 dataset (1,200+ words)
- [ ] N1 dataset (2,000+ words)
- [ ] Advanced example sentences
- [ ] Audio generation for all

**16. Mobile Apps**
- [ ] React Native setup
- [ ] iOS app (App Store)
- [ ] Android app (Play Store)
- [ ] Push notifications
- [ ] Offline sync

---

## Development Phases

### Phase 2: Core Features (Current Focus)

**Goal:** Activate existing features and achieve launch-ready status

**Tasks:**
1. Audio production migration
2. Firebase authentication activation
3. Cloud sync implementation
4. Complete AI verification
5. Add testing suite
6. Complete N4 dataset

**Success Criteria:**
- ✅ All services functional
- ✅ N5 & N4 datasets 95%+ coverage
- ✅ Users can create accounts
- ✅ Data syncs across devices
- ✅ 60%+ test coverage

**Est. Time:** 3-4 weeks (solo developer)
**Est. Time:** 1-2 weeks (with team)

---

### Phase 3: Premium & Growth

**Goal:** Monetization and user acquisition

**Tasks:**
1. Stripe integration
2. Premium tier features
3. SEO optimization
4. Content marketing
5. Community features
6. N3 dataset

**Success Criteria:**
- ✅ Payment flow working
- ✅ 100+ active users
- ✅ $100+ MRR (Monthly Recurring Revenue)
- ✅ N3 dataset available

**Est. Time:** 2-3 months

---

### Phase 4: Scale & Polish

**Goal:** Mobile apps and advanced features

**Tasks:**
1. React Native mobile apps
2. N2 & N1 datasets
3. Advanced learning modes
4. Gamification
5. Social features

**Success Criteria:**
- ✅ Mobile apps launched
- ✅ All JLPT levels covered (N5-N1)
- ✅ 1,000+ active users
- ✅ $1,000+ MRR

**Est. Time:** 6-12 months

---

## Technical Debt

### High Priority Debt

1. **Audio Licensing**
   - Current: Edge TTS (unlicensed)
   - Risk: Cannot launch with current audio
   - Solution: Migrate to VOICEVOX/Azure

2. **No Test Coverage**
   - Current: 0% test coverage
   - Risk: Hard to refactor safely
   - Solution: Add Jest + RTL tests

3. **Hard-coded Configuration**
   - Current: Some config in code
   - Risk: Hard to deploy to different envs
   - Solution: Move to .env files

### Medium Priority Debt

4. **Large Bundle Size**
   - Current: ~1.2MB bundle
   - Impact: Slower initial load
   - Solution: Code splitting, lazy loading

5. **No Error Tracking**
   - Current: Console.log only
   - Impact: Can't debug production issues
   - Solution: Add Sentry

6. **IndexedDB Migrations**
   - Current: No migration testing
   - Risk: Breaking changes lose user data
   - Solution: Add migration tests

---

## Known Issues

### Critical

- [ ] Audio files use unlicensed TTS (Edge TTS)
- [ ] No error boundary in production
- [ ] Missing CORS headers for audio CDN

### High

- [ ] Flashcard animation sometimes glitches on slow devices
- [ ] Search doesn't highlight matches
- [ ] Quiz mode doesn't save partial progress

### Medium

- [ ] Dark mode flash on page load
- [ ] Settings don't sync across tabs
- [ ] No loading states for slow connections

### Low

- [ ] Footer links go to placeholder pages
- [ ] About page needs content
- [ ] No 404 custom page

---

## Feature Requests

### From User Feedback (Hypothetical)

1. **Kanji breakdown view** - Show components and radicals
2. **Custom deck creation** - Let users make their own decks
3. **Streak reminders** - Notifications when streak at risk
4. **Dark theme colors** - More color scheme options
5. **Audio speed control** - Slow down for beginners

### Technical Improvements

1. **Offline mode** - Service worker implementation
2. **Better search** - Fuzzy search with Fuse.js (already included)
3. **Keyboard shortcuts** - Power user features
4. **Export to Anki** - Export format compatibility
5. **Import from CSV** - Easy bulk import

---

## Success Metrics

### Launch Targets (Month 1)

- [ ] 100 sign-ups
- [ ] 50 active daily users
- [ ] 1,000+ cards studied
- [ ] 80%+ user retention (7 days)
- [ ] <2s page load time

### Growth Targets (Month 3)

- [ ] 500 total users
- [ ] 200 active daily users
- [ ] 10,000+ cards studied
- [ ] 5+ paying users
- [ ] $50+ MRR

### Long-term Targets (Year 1)

- [ ] 10,000 total users
- [ ] 1,000 active daily users
- [ ] 1M+ cards studied
- [ ] 100+ paying users
- [ ] $1,000+ MRR

---

## Resources Needed

### Development

- [ ] Solo developer time: 20-30 hrs/week
- [ ] (Optional) Frontend developer for UI polish
- [ ] (Optional) Backend developer for scaling

### Services

- [ ] Firebase (free tier sufficient for MVP)
- [ ] Audio TTS (VOICEVOX free or Azure ~$1-5)
- [ ] CDN for audio (Cloudflare R2 free tier)
- [ ] Domain name (~$10-15/year)
- [ ] Hosting (Vercel free tier)

### Marketing

- [ ] Content writer for blog posts
- [ ] Social media presence (Twitter, Reddit)
- [ ] Product Hunt launch
- [ ] Japanese learning communities outreach

---

## Next Steps (This Week)

1. **Monday-Tuesday:** Choose and implement production TTS
2. **Wednesday:** Complete 5 AI verification batches
3. **Thursday:** Set up Firebase and activate auth
4. **Friday:** Add first batch of unit tests
5. **Weekend:** Test entire flow end-to-end

---

**For implementation details, see:**
- `01_GETTING_STARTED.md` - Development setup
- `02_ARCHITECTURE.md` - Technical architecture
- `03_DATA_PIPELINE.md` - Data processing
- `05_AUDIO_PRODUCTION.md` - TTS migration guide
