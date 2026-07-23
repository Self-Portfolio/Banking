const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function ownsAccount(userId, accountId) {
  return db.state.accounts.some((a) => a.id === accountId && a.userId === userId);
}

// GET /api/accounts/:id/transactions?search=&from=&to=&page=&pageSize=
router.get('/:id/transactions', requireAuth, (req, res) => {
  const accountId = Number(req.params.id);
  if (!ownsAccount(req.userId, accountId)) {
    return res.status(404).json({ error: 'Account not found' });
  }

  let items = db.state.transactions.filter((t) => t.accountId === accountId);

  const { search, from, to } = req.query;

  if (search) {
    // NOTE: intentionally case-sensitive substring match. The frontend's
    // placeholder text implies case-insensitive search, so this is a
    // deliberate mismatch left in for testers to discover.
    items = items.filter((t) => t.description.includes(search));
  }

  if (from) {
    const fromDate = new Date(from);
    items = items.filter((t) => new Date(t.date) >= fromDate); // inclusive
  }
  if (to) {
    const toDate = new Date(to);
    items = items.filter((t) => new Date(t.date) < toDate); // exclusive - inconsistent with `from`
  }

  items = items.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.max(1, parseInt(req.query.pageSize, 10) || 5);
  const totalItems = items.length;

  // NOTE: intentional off-by-one seeded bug. When totalItems is an exact
  // multiple of pageSize, this yields one extra (empty) page.
  const totalPages = Math.floor(totalItems / pageSize) + 1;

  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  res.json({
    transactions: pageItems,
    page,
    pageSize,
    totalItems,
    totalPages
  });
});

module.exports = router;
