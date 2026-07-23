# Answer Key — Seeded Bugs

This app is otherwise deterministic and well-behaved. The bugs below were put in
on purpose so your test automation has real defects to catch. Try writing
tests that discover these *before* reading the explanations — then come back
and check your results against this list.

## Bug 1 — Pagination off-by-one
**Where:** `GET /api/accounts/:id/transactions` — [backend/src/routes/transactions.js](backend/src/routes/transactions.js)

`totalPages` is computed as `Math.floor(totalItems / pageSize) + 1`. When
`totalItems` is an exact multiple of `pageSize` (e.g. 10 items, page size 5),
this yields one extra, empty page. The correct formula is
`Math.ceil(totalItems / pageSize)`.

**How to catch it:** seed/create an account with exactly N * pageSize
transactions and assert `totalPages === N`, not `N + 1`. Also assert the
"Next" button is disabled once you're actually on the last page with data.

## Bug 2 — Case-sensitive transaction search
**Where:** same file, the `search` filter uses `.includes(search)` instead of
a case-insensitive comparison.

**How to catch it:** search for `"grocery"` (lowercase) and confirm it still
matches `"Grocery Store Purchase"`. It currently won't unless the case matches
exactly.

## Bug 3 — Stale dashboard balance after a transfer
**Where:** [frontend/src/context/AccountsContext.jsx](frontend/src/context/AccountsContext.jsx)
and [frontend/src/pages/Transfer.jsx](frontend/src/pages/Transfer.jsx)

The Dashboard reads accounts from a cached context that's only fetched once.
Transfer and Bill Pay update their own local copy of the "from" account for
the confirmation screen, but never invalidate the shared cache. Navigating
back to the Dashboard after a transfer shows the pre-transfer balance until
you click "Refresh".

**How to catch it:** transfer money, navigate to `/dashboard`, and assert the
balance shown matches the new balance — it won't, until Refresh is clicked.

## Bug 4 — Client/server validation mismatch on transfer amount
**Where:** [frontend/src/pages/Transfer.jsx](frontend/src/pages/Transfer.jsx) `handleReview`
vs. [backend/src/routes/transfers.js](backend/src/routes/transfers.js)

The client only blocks negative amounts (`numeric < 0`), so `0` passes
client-side validation and reaches the review screen. The server correctly
rejects any amount `<= 0` with a 400. Result: submitting a $0.00 transfer gets
you to the confirmation screen, then fails on submit with a raw server error
instead of being caught earlier with a friendlier message.

**How to catch it:** covered in `e2e/tests/transfer.spec.js` — see the test
named "a zero-amount transfer passes client validation but fails on the server".

## Bug 5 — Session timeout is never enforced client-side
**Where:** [backend/src/middleware/auth.js](backend/src/middleware/auth.js) (`TOKEN_TTL_SECONDS = 15 * 60`)
and [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)

JWTs correctly expire after 15 minutes server-side, but the frontend never
watches for this. There's no countdown, warning, or auto-redirect — the user
only discovers they're logged out the next time they make an API call and it
fails with a 401.

**How to catch it:** log in, wait for (or forge/expire) the token, then
trigger any authenticated request and confirm the app redirects to `/login`
with a reasonable message — currently it just fails silently on that one
request.

## Bug 6 — Inconsistent date-range boundaries
**Where:** [backend/src/routes/transactions.js](backend/src/routes/transactions.js)

The `from` filter is inclusive (`>=`) but the `to` filter is exclusive (`<`).
A transaction dated exactly on the `to` date will be silently excluded.

**How to catch it:** create a transaction on a specific date, then filter
`to=<that date>` and assert whether it's included — pick a convention (most
testers expect inclusive on both ends) and write the boundary-value test.

---

None of these are deep bugs — they're the kind of thing that slips through
code review and gets caught by a good automated regression suite. That's the
point.
