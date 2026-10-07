# FoodHub

A food ordering app built with Next.js 15 (App Router), React 19, Tailwind CSS 4 and MongoDB. Users can browse the menu, keep a cart and wishlist, register or sign in, place orders and send contact messages. It is an installable **Progressive Web App** with offline support, and it has unit, component and end-to-end tests.

## Contents
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Progressive Web App](#progressive-web-app)
- [Testing](#testing)
- [Interview notes](#interview-notes)
- [Known limitations](#known-limitations)

## Tech stack
| Area | Tools |
|---|---|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MongoDB with Mongoose |
| Auth | JWT (`jose`) in an httpOnly cookie, passwords hashed with `bcryptjs` |
| PWA | Web app manifest + hand-written service worker |
| Unit/component tests | Vitest, React Testing Library, user-event, jsdom |
| End-to-end tests | Playwright (Chromium) |

## Getting started

### 1. Install
```bash
npm install
```

### 2. Environment variables
Create a `.env` file in the project root:
```
MONGODB_URI=mongodb://127.0.0.1:27017/foodhub
JWT_SECRET=replace-with-a-long-random-string
```

### 3. Run
```bash
npm run dev      # development server on http://localhost:3000
npm run build    # production build
npm start        # run the production build
npm run lint     # ESLint
```
The menu is seeded into MongoDB automatically the first time `/api/products` is called.

### All scripts
| Script | What it does |
|---|---|
| `npm run dev` | Dev server (service worker is disabled) |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | Unit and component tests (Vitest), single run |
| `npm run test:watch` | Re-run unit tests on every save |
| `npm run test:coverage` | Unit tests with a coverage report |
| `npm run test:e2e` | End-to-end tests (Playwright) |

## Project structure
```
src/
  app/
    api/            auth (register, login, logout, me), products, orders, contact
    manifest.ts     PWA manifest
    offline/        offline fallback page
    cart, login, product, profile, wishlist, about, contact, page.tsx
  components/       Navbar, ProductCard, Providers, PwaRegister
  context/          AuthContext, StoreContext (cart + wishlist)
  data/products.ts  seed catalog
  lib/              auth (JWT/cookies), mongodb (connection), products
  models/           User, Product, Order, Contact (Mongoose)
  test/             shared test setup and service worker tests
public/
  sw.js             service worker
  icons/            PWA icons
scripts/
  generate-icons.mjs  regenerates the PWA icons
tests/e2e/          Playwright specs
```

---

## Progressive Web App

A PWA is a web app that can be installed, runs in its own window, loads fast through caching, and keeps working on a bad or missing connection. It needs three things: a **web app manifest**, a **service worker** and **HTTPS** (localhost counts as secure for development).

### What was added
| File | Purpose |
|---|---|
| `src/app/manifest.ts` | Manifest: name, `start_url`, `display: standalone`, theme color, 192/512 and maskable icons. Next.js serves it at `/manifest.webmanifest`. |
| `public/icons/*` | App icons (192, 512, maskable 512, apple-touch-icon). Currently orange placeholders with "FH". |
| `public/sw.js` | The service worker (caching rules below). |
| `src/components/PwaRegister.tsx` | Registers the service worker (production only) and shows a custom "Install FoodHub" button. |
| `src/app/offline/page.tsx` | Page shown when the user is offline and the requested page isn't cached. |
| `src/app/layout.tsx` | Theme color, apple-touch-icon, Apple web app metadata, and `<PwaRegister />`. |
| `scripts/generate-icons.mjs` | Regenerates the icons with `node scripts/generate-icons.mjs`. |

### Service worker caching rules
| Request | Strategy | Why |
|---|---|---|
| `/_next/static`, `/_next/image`, `/icons` | Cache-first | Fingerprinted and immutable, so this is fastest. |
| `/api/products` | Stale-while-revalidate | The menu shows instantly, even offline, and refreshes in the background. |
| Page navigations | Network-first, then cached page, then `/offline` | Fresh content when online, graceful fallback when not. |
| `/api/auth/*`, `/api/orders`, all non-GET requests, cross-origin requests | **Never cached** (network only) | Caching these could leak user data or show stale order state. |

### Service worker lifecycle
- **install**: pre-cache `/offline` and call `skipWaiting()`.
- **activate**: delete old `foodhub-*` caches (names contain a `VERSION`) and call `clients.claim()`.
- **fetch**: pick a strategy from the table above.

When you change `public/sw.js`, bump `VERSION` at the top so old caches are cleared.

### Install prompt
Chrome fires `beforeinstallprompt`. The app calls `preventDefault()`, stores the event and shows its own install button, which calls `prompt()`. The `appinstalled` event hides the button. iOS has no such event, so iOS users install with Share, then Add to Home Screen.

### Try it
1. `npm run build && npm start`
2. Open `http://localhost:3000` in Chrome.
3. DevTools, Application tab: check **Manifest**, **Service Workers** and **Cache Storage**.
4. In the Network tab tick **Offline** and reload. A visited page loads from cache and an unvisited one shows `/offline`.
5. Run a Lighthouse audit.

To install on a phone, deploy over HTTPS (for example Vercel).

### Design decisions
- **Hand-written service worker instead of Serwist/next-pwa.** The app is small, so there is no extra dependency or build plugin, and the caching rules are fully visible. For a larger app, Serwist (Workbox-based) adds precaching and versioning.
- **Registered in production only.** In development a service worker would cache stale code and cause confusing bugs.
- **Auth and orders are excluded from the cache** for security and correctness.
- **Maskable icon** has extra padding so Android can crop it into circles or squircles.

---

## Testing

There are **122 unit/component tests** (Vitest) and **19 end-to-end tests** (Playwright). Neither set needs a running MongoDB: the database is mocked in unit tests and the API is mocked in the end-to-end flows.

### The testing pyramid
| Layer | Tool | What it proves | Speed |
|---|---|---|---|
| Unit | Vitest | Single functions, models and API routes behave correctly | Milliseconds |
| Component | Vitest + React Testing Library | The UI behaves the way a user sees it | Fast |
| End-to-end | Playwright | The whole app works in a real browser | Seconds |

### Running the tests

**Unit and component tests**
```bash
npm test                                              # run everything once
npx vitest run src/components/PwaRegister.test.tsx    # a single file
npm run test:watch                                    # re-run on save
npm run test:coverage                                 # coverage report
```

**End-to-end tests**
```bash
npx playwright install chromium     # first time only
npm run test:e2e
```
This builds the app, starts it on port 3100 and runs the tests in Chromium. The first run takes a few minutes because of the build. If a server is already running on port 3100 it is reused. If a run seems stuck, check for a leftover process on that port.

**Watching the browser tests**
| Command | What it does |
|---|---|
| `npx playwright test --ui` | Visual runner: step through each test and time-travel. Best for demos. |
| `npx playwright test --headed` | Runs with a visible browser window. |
| `npx playwright test --debug` | Pauses so you can go action by action. |
| `npx playwright test pwa.spec.ts` | One spec file. |
| `npx playwright test -g "offline"` | Tests whose name contains "offline". |
| `npx playwright test --reporter=html` then `npx playwright show-report` | HTML report. |

Failed runs write details to `test-results/` (`error-context.md`, and traces if you pass `--trace on`).

### What is tested

| Area | Files | Highlights |
|---|---|---|
| Auth library | `src/lib/auth.test.ts` | JWT round-trip, tampered and garbage tokens rejected, missing secret throws, cookie is httpOnly + lax + 7 days, `getSession` for valid, invalid and absent cookies |
| Auth routes | `src/app/api/auth/auth-routes.test.ts` | Register validation, duplicate email returns 409, password is hashed (verified with bcrypt), email normalised. Login gives the same error for unknown user and wrong password, and never returns the hash. Logout and `me`. |
| Orders | `src/app/api/orders/route.test.ts` | 401 when signed out, invalid items, payment method and delivery rejected, **totals computed from server-side prices** (client prices ignored), order tied to the session user, only own orders returned |
| Contact and products routes | `src/app/api/contact`, `src/app/api/products` | Validation, trimming, unknown subject falls back to "general", error handling |
| Products library | `src/lib/products.test.ts`, `src/data/products.test.ts` | Seeding, upsert, serialization, unique ids, valid categories and prices |
| Models | `src/models/models.test.ts` | Required fields, enums, min password length, quantity and price rules, defaults, using schema validation with no database |
| State | `src/context/StoreContext.test.tsx`, `AuthContext.test.tsx` | Cart add, increment, update, remove, clear, totals, localStorage persistence, corrupt storage, wishlist, auth loading, 401, network failure, logout |
| Components | `ProductCard`, `Navbar`, `PwaRegister` tests | Cart and wishlist actions, logged in vs. out navbar, badge, mobile menu with Escape, install button lifecycle, production-only service worker registration |
| Pages | `contact`, `login`, `cart` page tests | Success, server error and network failure paths, request payloads, cart cleared and redirect after ordering |
| PWA | `src/app/manifest.test.ts`, `src/test/sw.test.ts` | Manifest fields and icon files exist. The real `public/sw.js` runs against an in-memory cache: install, activate cleanup, every strategy, offline fallback, and that auth, orders and POSTs are never touched. |
| End-to-end PWA | `tests/e2e/pwa.spec.ts` | Manifest and icons served, service worker activates, offline page, visited page works offline, auth and orders never in Cache Storage |
| End-to-end app | `tests/e2e/app.spec.ts` | Navigation, mobile menu, menu list, cart that survives reload, wishlist, guest checkout blocked, checkout payload, login success and failure, register toggle, contact form |

### Test setup details
- **Config:** `vitest.config.mts` (jsdom, `@` alias, test env vars) and `playwright.config.ts` (port 3100, builds and starts the production app).
- **Shared setup:** `src/test/setup.ts` adds jest-dom matchers, cleans up between tests, clears localStorage, and replaces `next/image` and `next/link` with plain elements.
- **Server tests use the Node environment** (`// @vitest-environment node`). `jose` fails in jsdom with "payload must be Uint8Array" because jsdom has its own typed-array realm.
- **Mocking:** `vi.mock` replaces MongoDB, the models and `next/headers`. `vi.hoisted` makes the mocks available before imports.
- **Playwright mocks the API** with `page.route()`, and the app-flow tests set `serviceWorkers: "block"` so the service worker doesn't bypass interception. The PWA tests keep the real service worker enabled.
- **Production build for E2E**, because the service worker only registers in production.
- **Offline testing:** `context.setOffline(true)` and then reload.
- **Test style:** Arrange, Act, Assert; one behavior per test; React Testing Library queries by role, label, placeholder or text, never by implementation details.

### Problems found while testing
1. **jsdom vs. `jose`:** fixed by running server tests in the Node environment.
2. **Flaky contact-form E2E test:** right after load, Next briefly renders two copies of the form while streaming. The test waits for `networkidle` before interacting.
3. **Cart success message:** the "Order saved to your account!" message is never visible, because `clearCart()` empties the cart and the page switches to its empty state before the redirect. The test documents the real behavior.

---

## Interview notes

### 30-second pitch: PWA
"FoodHub is a Next.js 15 app with MongoDB. I turned it into a Progressive Web App so users can install it and use it like a native app, with graceful offline behavior. A PWA needs a manifest, a service worker and HTTPS. I added all three, plus an offline fallback page and a custom install button. The service worker never caches authenticated or order data."

### 30-second pitch: testing
"I set up three layers of tests: Vitest for unit, API and model tests, React Testing Library for components, and Playwright for end-to-end flows in a real browser. That's 122 unit/component tests and 19 E2E tests. The database is mocked so tests are fast and deterministic. I also tested the service worker itself, including the rule that auth and order data are never cached."

### PWA questions
**How is a PWA different from a native app?**
It's distributed through the web with no store review, but has more limited device API access, and iOS support is weaker (install behavior, push notifications).

**Cache-first vs. network-first vs. stale-while-revalidate?**
Cache-first returns the cache and only goes to the network on a miss. Network-first tries the network and falls back to the cache. Stale-while-revalidate returns the cached copy immediately and updates it in the background.

**How do you update a service worker?**
The browser byte-compares `sw.js` on each load. A changed file installs as a new worker, which waits until old tabs close unless `skipWaiting()` is called. I also bump the cache version to purge old caches.

**Why not cache everything?**
Caching authenticated or dynamic data risks showing another user's data or stale state. Only public, safe resources are cached.

**Why is the service worker in `public/`?**
It must be served from the root path so its scope covers the whole site. A worker's scope cannot exceed its own directory.

**How would you support offline orders?**
Queue failed POSTs in IndexedDB and replay them with the Background Sync API when the connection returns. Not built yet.

### Testing questions
**Unit vs. integration vs. E2E?**
Unit tests one piece in isolation, integration tests pieces working together, and E2E tests the whole system the way a user does.

**Why mock the database?**
Speed, determinism and no setup. The downside is possible drift from real behavior, so a few real-database integration tests would complement it.

**What makes a test flaky and how do you fix it?**
Timing, shared state, network and ordering. Fix with auto-waiting or waiting for a condition (never fixed sleeps), isolated state per test and mocked network. Retries are a last resort.

**Why test behavior, not implementation?**
Implementation-coupled tests break on refactors without catching real bugs. Role-based queries mimic how users and assistive tech find things.

**Is 100% coverage the goal?**
No. Coverage shows what is untested, not whether the tests are good. I prioritise meaningful assertions on critical paths: money (orders and totals), security (auth, caching rules) and core user flows.

**How did you test authentication?**
Unit-tested token and route logic including failure paths, checked security properties (hashed password, httpOnly cookie, identical error messages, no hash in responses), and mocked the session endpoint in E2E.

**How did you test the service worker?**
Two ways: a unit test that runs the real worker file with fake `self`, `caches` and `fetch`, and a Playwright test in real Chromium using offline mode and Cache Storage inspection.

**What would you add next?**
A CI pipeline, a real-database integration layer, accessibility checks (axe), multi-browser Playwright projects, and Lighthouse CI.

---

## Known limitations
- PWA icons are placeholders. Replace them with your logo and run `node scripts/generate-icons.mjs`.
- No offline ordering or background sync.
- No push notifications. The next step would be the Push API with VAPID keys.
- API tests mock Mongoose, so real MongoDB queries and indexes are not verified. `mongodb-memory-server` would cover that.
- No CI workflow yet, no accessibility or visual regression tests, and E2E runs in Chromium only.
