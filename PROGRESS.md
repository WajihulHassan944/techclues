# Progress — techclues (frontend)

## Phase 2: integrate with the backend

### Done
- `lib/api/client.ts`: typed fetch wrapper (timeout, JSON error shape, bearer token handling,
  one retry on 401 via `/auth/refresh`). `lib/api/auth.ts`: login/logout/restoreSession/changePassword.
- Public forms wired to the real API, keeping existing styling/validation/success states:
  contact, MVP cost calculator ("Submit my estimate" step), ZERO.ONE brief, the footer newsletter
  signup (extracted into its own client component, `NewsletterFooterForm`), and the booking widget
  (`availableSlots()` now calls `GET /api/public/availability`; "Confirm booking" calls
  `POST /api/public/bookings` and shows a real error if the slot was taken in the meantime).
- Admin panel: all six localStorage-backed providers (Inbox, Bookings, Blog, Newsletter, Settings,
  Activity) replaced with API-backed versions that keep the same context shape, so the view
  components needed almost no changes beyond dropping the "restore sample data" buttons (no longer
  meaningful once "sample data" is just whatever's really in the database).
- Real JWT auth: `LoginForm` and `AdminShell`'s guard now use `restoreSession()` (reads the
  httpOnly refresh cookie) instead of a localStorage flag; `Security`'s password-change form calls
  the real `/auth/change-password` endpoint.
- Cloudinary image uploads wired into both the rich text editor and the post cover-image picker
  (previously embedded images as base64 data URLs).
- Pusher realtime: `AdminShell` subscribes to the private-admin channel and refreshes the relevant
  provider + toasts on `enquiry.created`, `booking.created`, `booking.updated`, `subscriber.created`,
  `reply.sent`.
- `generateStaticParams` removed from `/admin/inbox/[id]` and `/admin/blog/[id]` — they hardcoded
  the old sample ids (`enq-1001`, `post-1001`); real Mongo ObjectIds now render on demand.
- `npm run build` passes clean (52 routes, both dynamic admin detail pages now render `ƒ` not `○`).

### Playwright e2e suite — updated, not fully re-verified
Every admin spec (`admin-inbox`, `admin-dashboard`, `admin-bookings`, `admin-blog`,
`admin-newsletter`, `admin-settings`) and `admin.spec.ts` itself needed real structural changes,
not just a password string swap, because the architecture changed underneath them:

- **Real auth**: `signIn()` helpers now fill `process.env.E2E_ADMIN_PASSWORD` instead of the old
  "any password works" placeholder.
- **Shared, persistent backend state**: the old localStorage data reset for free on every test
  (fresh browser context = fresh `seedInbox()` call). The real backend persists mutations across
  tests, so every describe block that mutates data now calls `reseed()` (a helper in
  `e2e/helpers/backend.ts` that shells out to `techclues-api`'s `npm run seed`) in `beforeEach`,
  and runs with `test.describe.configure({ mode: "serial" })` so parallel workers can't race on
  shared data.
- **No more sequential sample ids**: `enq-1001`, `post-1003`, etc. are gone — real documents get
  Mongo ObjectIds. Added `openEnquiryByText()` / `openPostByText()` helpers that navigate the real
  UI (search/click) and return the actual id, used everywhere a test used to `page.goto()` a
  hardcoded sample id directly.
- **Cross-origin cookies on `localhost`**: this was the subtle one. In production, the frontend and
  API are on different Vercel domains and the refresh cookie correctly uses `SameSite=None; Secure`
  over HTTPS — verified working with live `curl` tests (see `techclues-api`'s progress notes).
  Locally, two different `http://` ports count as cross-site too, but `SameSite=None` requires
  `Secure`, which browsers won't send over plain HTTP — so the cookie-based session silently never
  attached to the refresh call, and the admin login appeared to "fail" with no visible error (the
  login API call itself returned 200; only the *subsequent* session check failed). Fixed for local
  testing with a dev-only same-origin proxy: `next.config.mjs` rewrites `/api/*` to
  `API_PROXY_TARGET` when that env var is set, so the browser only ever talks to its own origin and
  the cookie is first-party. Production is unaffected (that env var is never set there).
- **Backend-driven activity log text**: a couple of assertions expected exact strings from the old
  client-side `logActivity()` calls (e.g. "Replied to Sarah Whitfield (Tutoring marketplace...)").
  The real backend logs its own, slightly different wording for the same actions (e.g. "Replied to
  Sarah Whitfield's enquiry") — updated the assertions to match, rather than changing backend
  wording to match a test.
- **One assertion removed, not just adjusted**: `admin-settings.spec.ts` checked for an activity log
  entry ("Published 'How much does an MVP cost in the UK?'") that only existed because the old fake
  data generator wrote it directly into the sample activity log. The real backend only logs actions
  taken *through* the app; the seed script inserts blog posts straight into MongoDB (bypassing the
  publish-post service method), so there's no corresponding real activity entry. Removed that one
  assertion rather than fabricate a fake log entry at seed time to satisfy it.
- **"Signed-in devices" trimmed from 3 to 1**: the old UI showed two entirely fake extra
  device rows ("iPhone · Safari", "MacBook · Chrome") with hardcoded fake locations/timestamps.
  There's no real multi-device session tracking in the new backend (only a single refresh-token
  cookie per login), so showing fabricated other devices would be actively misleading. Trimmed the
  list to the one real session and updated the test to match, rather than keep fake rows just to
  keep an old assertion green.

**What's verified**: `admin.spec.ts` (login + shell navigation) — 11/14 passing after the proxy fix,
with 3 intermittent failures under 2 parallel workers on a dev build that look like timing
flakiness (not a real auth/data bug — see techclues-api's note on this). The full admin-inbox run
with the fixes above was in progress when this note was written; **the other four admin-*.spec.ts
files have been edited for correctness but not yet run end-to-end** — that's the next thing to do,
not something to assume passes.

### Not done yet
- Frontend not yet deployed to Vercel with the integration changes, or live-smoke-tested in a real
  browser end to end (no browser automation tool was available this session — see the chat for the
  HTTP-level verification that was done instead: CORS preflight, a real cross-origin login setting
  the cookie with correct `SameSite=None; Secure` attributes, and a real contact-form POST, all
  against the live deployed API).
- Grant, Partner and Careers forms are still non-functional (not in the original brief's wiring list
  for this phase).
- The calculator's cost estimate is computed client-side and trusted as-is by the backend (see
  techclues-api's README "Known gaps" — not re-derived server-side).
