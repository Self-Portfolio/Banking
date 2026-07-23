# Bank of Hamed_SDET

A full-stack mock online-banking application built specifically for **practicing
test automation** — UI (Selenium/Playwright/Cypress), API (Postman/Newman,
RestAssured, supertest), and CI/CD pipelines. Not a real bank, not connected to
any real money or accounts.

## What's included

- **backend/** — Node.js + Express REST API, JWT auth, JSON-file datastore
  (no native modules, so it installs cleanly on Windows with no build tools).
  Includes Jest + Supertest unit/API tests.
- **frontend/** — React (Vite) single-page app: login/register, account
  dashboard, transaction history with search/filter/pagination, fund
  transfers, bill pay. Every interactive element has a stable `data-testid`
  attribute for reliable automation selectors.
- **e2e/** — Playwright starter test suite (login + transfer flows) you can
  build on to "prepare test automation cases."
- **openapi.yaml** — API spec you can import into Postman/Insomnia or feed to
  a contract-testing tool.
- **.github/workflows/ci.yml** — GitHub Actions pipeline: backend tests →
  frontend build → Playwright e2e, on every push/PR.
- **ANSWER_KEY.md** — a handful of intentionally seeded bugs (pagination,
  case sensitivity, stale UI state, validation mismatches, etc.) for your
  tests to discover. Don't peek until you've tried to find them yourself.

## Quick start (local)

You need [Node.js](https://nodejs.org) 18+ installed. Then, in three terminals:

```bash
cd backend && npm install && npm run dev
```

```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:5173 in your browser. Backend runs on port 4000,
frontend on port 5173 (the frontend is hardcoded to call the backend at
`http://localhost:4000/api`).

**Demo login:** username `jdoe`, password `Password123!`
(a second user `msmith` / `Password123!` also exists, useful for
cross-account transfer tests.)

The first time the backend starts it auto-seeds `backend/data/db.json` with
demo accounts and transaction history. To reset back to that clean state at
any point:

```bash
cd backend && npm run seed
```

or, while the server is running, `POST http://localhost:4000/api/test/reset`
(handy to call from a test suite's setup/teardown).

## Running the tests

**Backend unit/API tests (Jest + Supertest):**
```bash
cd backend && npm test
```

**Playwright end-to-end tests:**
```bash
cd e2e && npm install && npx playwright install chromium && npm test
```
This automatically starts both the backend and frontend dev servers for you
(see `e2e/playwright.config.js`) if they aren't already running, and resets
the database before each test file so results are repeatable.

View the HTML report after a run: `cd e2e && npm run report`

## CI/CD

`.github/workflows/ci.yml` runs on every push/PR to any branch:
1. Backend Jest tests
2. Frontend production build
3. Playwright e2e suite (with the HTML report uploaded as an artifact)

To use it, push this folder to a GitHub repository — the workflow needs no
secrets or external services.

## Project structure

```
banking-test-app/
├── backend/           Express API + JSON datastore + Jest tests
│   ├── src/
│   │   ├── routes/    auth, accounts, transactions, transfers, payees
│   │   ├── middleware/auth.js   JWT sign/verify
│   │   ├── db.js       tiny JSON-file datastore
│   │   ├── seed.js     demo data
│   │   └── index.js    app entry point
│   └── tests/         auth.test.js, transfers.test.js
├── frontend/           React + Vite SPA
│   └── src/
│       ├── pages/      Login, Register, Dashboard, AccountDetails, Transfer, BillPay, Profile
│       ├── context/     AuthContext, AccountsContext
│       └── api.js       fetch wrapper
├── e2e/                 Playwright starter suite
├── openapi.yaml
├── ANSWER_KEY.md
└── .github/workflows/ci.yml
```

## Suggested test cases to write yourself

This ships with a small starter suite, not full coverage — the point is for
you to build it out. Some ideas:

- **Auth:** empty fields, wrong password, expired/tampered token, duplicate
  registration, password length boundary (7 vs 8 chars).
- **Accounts/transactions:** pagination boundaries, search case sensitivity
  (see `ANSWER_KEY.md`), date-range filtering, sort order, empty states.
- **Transfers:** insufficient funds, transfer to self, transfer to another
  user's account, decimal rounding (e.g. `10.005`), negative/zero amounts.
- **Bill pay:** adding/removing payees, paying with no payees, duplicate
  payee names.
- **API-level:** run the same scenarios directly against the endpoints in
  `openapi.yaml` without going through the UI at all — status codes, response
  shapes, auth header handling.
- **CI:** intentionally break a test to confirm the pipeline fails the build,
  then fix it and confirm it's green again.
