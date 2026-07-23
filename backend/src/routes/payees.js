const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const payees = db.state.payees.filter((p) => p.userId === req.userId);
  res.json({ payees });
});

router.post('/', requireAuth, (req, res) => {
  const { name, accountNumber, category } = req.body || {};
  if (!name || !accountNumber) {
    return res.status(400).json({ error: 'name and accountNumber are required' });
  }
  const payee = {
    id: db.nextId(),
    userId: req.userId,
    name,
    accountNumber,
    category: category || 'Other'
  };
  db.state.payees.push(payee);
  db.save();
  res.status(201).json({ payee });
});

router.delete('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const state = db.state;
  const idx = state.payees.findIndex((p) => p.id === id && p.userId === req.userId);
  if (idx === -1) return res.status(404).json({ error: 'Payee not found' });
  state.payees.splice(idx, 1);
  db.save();
  res.status(204).end();
});

// POST /api/payees/:id/pay  { fromAccountId, amount, memo }
router.post('/:id/pay', requireAuth, (req, res) => {
  const payeeId = Number(req.params.id);
  const { fromAccountId, amount, memo } = req.body || {};

  const state = db.state;
  const payee = state.payees.find((p) => p.id === payeeId && p.userId === req.userId);
  if (!payee) return res.status(404).json({ error: 'Payee not found' });

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  const fromAccount = state.accounts.find((a) => a.id === Number(fromAccountId) && a.userId === req.userId);
  if (!fromAccount) return res.status(404).json({ error: 'Source account not found' });

  if (fromAccount.balance < numericAmount) {
    return res.status(422).json({ error: 'Insufficient funds' });
  }

  const rounded = Math.round(numericAmount * 100) / 100;
  fromAccount.balance = Math.round((fromAccount.balance - rounded) * 100) / 100;

  const tx = {
    id: db.nextId(),
    accountId: fromAccount.id,
    date: new Date().toISOString(),
    description: memo ? `Bill Pay - ${payee.name}: ${memo}` : `Bill Pay - ${payee.name}`,
    amount: -rounded,
    type: 'debit',
    category: 'Bill Pay',
    balanceAfter: fromAccount.balance
  };
  state.transactions.push(tx);
  db.save();

  res.status(201).json({ payment: tx, fromAccount });
});

module.exports = router;
