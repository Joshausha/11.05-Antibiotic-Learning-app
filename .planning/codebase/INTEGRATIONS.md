# External Integrations

**Analysis Date:** 2026-01-06

## APIs & External Services

**Medical Research Integration:**
- **NCBI E-utilities (PubMed)** - Research article search and retrieval
  - SDK/Client: Native `fetch()` API
  - Auth: Optional API key in `REACT_APP_PUBMED_API_KEY` (`.env.local`)
  - Endpoints used:
    - `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` - Article search
    - `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi` - Article details
  - Implementation: `src/services/pubmedService.ts`
  - Features:
    - Search PubMed articles with keyword filtering
    - Retrieve antibiotic guidelines
    - Get pathogen resistance patterns
    - Pediatric-specific guideline queries
    - 24-hour cache duration built-in
  - XML Response Handling: Custom parser with regex fallback

**CDC Data (Currently Disabled):**
- **CDC Data API** - Antibiotic resistance surveillance
  - Integration method: REST API via `fetch()`
  - Auth: API key in `REACT_APP_CDC_API_KEY` (optional)
  - Base URL: `REACT_APP_CDC_BASE_URL=https://data.cdc.gov/resource/`
  - Status: Feature flag `REACT_APP_ENABLE_CDC_DATA=false` (disabled by default)
  - Purpose: Resistance pattern data (experimental integration)

**No Other External APIs:**
- No payment processing (Stripe, PayPal)
- No authentication service (Auth0, Firebase Auth)
- No analytics platforms (Google Analytics, Mixpanel)
- No email service (SendGrid, Mailgun)
- No cloud storage (AWS S3, Google Cloud Storage)

## Data Storage

**Databases:**
- None - All medical data stored as static TypeScript/JSON files in `src/data/`

**File Storage:**
- Browser LocalStorage - Quiz progress and user preferences
  - `src/hooks/useLocalStorage.ts` - Storage abstraction
  - `src/hooks/useQuizProgress.ts` - Quiz completion tracking
  - No server-side persistence

**Caching:**
- In-memory JavaScript caching in PubMed service
  - 24-hour cache duration (`REACT_APP_CACHE_DURATION_HOURS=24`)
  - No Redis or external cache service

## Authentication & Identity

**Auth Provider:**
- None - No authentication system
- No user accounts or login system
- All data stored client-side in browser localStorage

**OAuth Integrations:**
- None

## Monitoring & Observability

**Error Tracking:**
- React ErrorBoundary component (`src/components/ErrorBoundary.tsx`)
- Browser console.error() logging (development only)
- No external error tracking service (Sentry, Rollbar)

**Analytics:**
- Performance monitoring via feature flag: `REACT_APP_ENABLE_PERFORMANCE_MONITORING`
- `src/utils/clinicalPerformanceMonitor.ts` - Client-side performance tracking
- No external analytics service

**Logs:**
- Browser console only (stdout via console.log)
- No server-side logging infrastructure

## CI/CD & Deployment

**Hosting:**
- None configured (static site can be deployed anywhere)
- Suggested targets: Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront
- Build command: `npm run build` generates static files in `build/`

**CI Pipeline:**
- No GitHub Actions, Travis CI, or CircleCI configuration detected
- Manual testing and deployment

## Environment Configuration

**Development:**
- Required env vars: None (all features optional)
- Optional env vars:
  - `REACT_APP_PUBMED_API_KEY` - Increases PubMed rate limits
  - `REACT_APP_DEBUG_MODE` - Enable debug logging
  - `REACT_APP_ENABLE_CORS_DEV_MODE` - CORS development bypass
- Secrets location: `.env.local` (gitignored)
- `.env.example` provided with 30+ documented variables

**Staging:**
- Not applicable (no deployment infrastructure)

**Production:**
- Static build artifacts only
- Environment variables baked into build via webpack DefinePlugin
- No runtime configuration

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Third-Party Libraries (Non-API)

**Visualization:**
- D3.js 7.8.5 - Client-side data visualization (15+ sub-packages)
- Cytoscape.js 3.33.1 - Graph analysis (client-side only)
- Chart.js 4.5.0 - Charts via react-chartjs-2

**Medical Content:**
- `ts-fsrs` 5.2.2 - Spaced repetition algorithm (no external service)
- All medical data bundled in application (no CDN or external database)

## Security Considerations

**API Key Storage:**
- Optional API keys stored in `.env.local` (not committed to git)
- Keys embedded in production build (client-side visible)
- PubMed API key optional (unauthenticated requests supported)

**HTTPS:**
- Development: Optional (bypass via `REACT_APP_DISABLE_HTTPS_REQUIREMENTS`)
- Production: Recommended but not enforced

**Data Validation:**
- Medical data validation via `REACT_APP_ENABLE_MEDICAL_VALIDATION=true`
- Client-side validation only (no backend)

---

*Integration audit: 2026-01-06*
*Update when adding/removing external services*
