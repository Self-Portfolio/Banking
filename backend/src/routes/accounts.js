const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const accounts = db.state.accounts.filter((a) => a.userId === req.userId);
  res.json({ accounts });
});

router.get('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const account = db.state.accounts.find((a) => a.id === id && a.userId === req.userId);
  if (!account) return res.status(404).json({ error: 'Account not found' });
  res.json({ account });
});

module.exports = router;
