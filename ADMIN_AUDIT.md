# TechClues admin panel — audit and fix log

Live site: https://techclues.vercel.app · Live API: https://techclues-api.vercel.app

Audited and fixed directly against production, per the brief. Every public form
and every admin action below was exercised with real HTTP requests against the
live API (curl) and, where applicable, the real admin login — not a local mock.
Test data was marked "TEST" and left in place in the live database for review.

## Status table

| Area | Before this round | After this round | Evidence |
|---|---|---|---|
| Contact / MVP brief / ZERO.ONE forms | Real (Phase 2) | Real | Unchanged — reconfirmed live |
| Grant funding form | **Static** — validated, sent nothing | **Real** — `POST /api/public/grant` | Submitted live, appeared in admin inbox as source "Grant support" |
| Partner form (join + refer) | **Static** | **Real** — `POST /api/public/partner` | Submitted both modes live |
| Careers form | **Static**, uncontrolled inputs, no honeypot | **Real**, controlled, honeypot added | Submitted live |
| Chat widget | **Fully decorative** — submit button permanently `disabled`, chips didn't toggle | **Real**, fully interactive | Submitted live |
| Booking widget | Real | Real | Unchanged |
| Newsletter footer signup | Real, but no welcome/unsubscribe email | Real + welcome + unsubscribe-confirmation email added | Subscribed live, welcome email sent |
| Admin reply to enquiry | Real, but signature duplicated (frontend + backend both appended it) | Real, signature appears once | Replied live, thread stores raw body only |
| Admin: status/star/spam/trash/notes/block | Real | Real | Unchanged |
| Admin: bookings reschedule/cancel/availability | Real | Real | Unchanged |
| Admin: blog CRUD + image upload | Real | Real | Unchanged |
| Admin: newsletter add/import/export | Import sent one request per address; export always exported everyone regardless of filter | Import is one request; export (CSV, server-side) honours the active status/source/search filter | Verified via curl with status filter |
| Dashboard | **Computed in the browser** from a capped (500-row) list; anything older than ~2 weeks was a seeded random generator, not real data | **Real** — new fields on the existing `/admin/dashboard/stats` endpoint; the "sample data" disclaimer is gone because the data is real | Verified via curl: `previousTotal`, `spark` present |
| Top-bar search | **Decorative** — swallowed Enter, did nothing | **Real** — debounced, grouped, keyboard-navigable, `GET /admin/search?q=` | Verified via curl against enquiries/bookings/subscribers/posts |
| Notification bell | **Permanently** "Nothing new yet" with a permanent dot | **Real** — `Notification` collection, created on new enquiry/booking/subscriber/failed reply, live via Pusher, mark-read/mark-all-read | Submitted a live enquiry, confirmed a real notification record appeared |
| Sessions (Settings → Security) | **Hardcoded** single fake row; "sign out of every device" only cleared the current browser's cookie | **Real** — `Session` collection, device/IP/created/last-used, per-session sign-out, "sign out all other sessions" | Logged in live, confirmed a real session row with parsed device |
| Privacy tools (find/export/erase) | Backend endpoints existed but the **frontend never called them** — operated only on whatever was already loaded in the browser | Frontend now calls the real `/admin/privacy/find` and `/admin/privacy/erase` endpoints; erase now also deletes the Brevo contact outright (previously only unlisted it) | Verified via curl |
| Emails | Plain string concatenation, inconsistent per call site, no text part, no threading headers, newsletter had no welcome/unsubscribe email | One shared branded HTML+text layout for all 11 email types, HTML-escaped, Message-ID/In-Reply-To on replies | All 11 templates sent for real to wajih786hassan@gmail.com and visually confirmed |
| `techcluesltd@gmail.com` hardcoded in the UI | Present in reply-sent toast, thread sender label, "signed in as" | Replaced with the real logged-in admin email (`/auth/me`) or the configured reply-from address | — |
| Dead sample-data files | `inbox-seed.ts`, `blog-seed.ts`, `blog-bodies.ts` unused but present; `Booking`/`BookingStatus` types lived in `bookings-seed.ts` | Deleted the three unused files; moved the still-used types to `bookings-types.ts` | — |
| Dynamic admin routes (`/admin/inbox/[id]`, `/admin/blog/[id]`) | Already fixed in an earlier round (no `generateStaticParams`) | Unchanged — reconfirmed | — |

## Not done this round (flagged, not silently skipped)

- **Removing the page-size caps** on the inbox/bookings/newsletter providers in favour of true pagination. This is the one item from the brief I did not attempt: it's the highest-risk, lowest-safety-margin change in the list (touches every admin list screen at once), and the dashboard's own numbers no longer depend on it since they now come from a dedicated, uncapped backend aggregation. Recommend doing this as its own focused pass.
- **Local Playwright e2e verification** of this round's fixes. I fixed the three assertions that the production changes genuinely broke (two dashboard-chart assertions that assumed fabricated historical data, one notification-dialog assertion, one sign-out button rename), and confirmed everything through direct production API calls — but the actual local Playwright run was killed twice by a host-level low-memory condition unrelated to the code. The fixes are logically verified against the real response shapes but not re-run end-to-end in a browser. Recommend a follow-up run on a machine with more headroom (or CI).
