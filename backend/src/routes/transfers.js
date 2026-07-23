const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, (req, res) => {
  const { fromAccountId, toAccountNumber, amount, memo } = req.body || {};

  if (!fromAccountId || !toAccountNumber || amount === undefined) {
    return res.status(400).json({ error: 'fromAccountId, toAccountNumber, and amount are required' });
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  const state = db.state;
  const fromAccount = state.accounts.find((a) => a.id === Number(fromAccountId) && a.userId === req.userId);
  if (!fromAccount) {
    return res.status(404).json({ error: 'Source account not found' });
  }

  const toAccount = state.accounts.find((a) => a.accountNumber === String(toAccountNumber));
  if (!toAccount) {
    return res.status(404).json({ error: 'Destination account number not found' });
  }

  if (toAccount.id === fromAccount.id) {
    return res.status(400).json({ error: 'Source and destination accounts must be different' });
  }

  if (fromAccount.balance < numericAmount) {
    return res.status(422).json({ error: 'Insufficient funds' });
  }

  const rounded = Math.round(numericAmount * 100) / 100;
  const now = new Date().toISOString();

  fromAccount.balance = Math.round((fromAccount.balance - rounded) * 100) / 100;
  toAccount.balance = Math.round((toAccount.balance + rounded) * 100) / 100;

  const debitTx = {
    id: db.nextId(),
    accountId: fromAccount.id,
    date: now,
    description: memo ? `Transfer to ${toAccount.nickname || toAccount.accountNumber}: ${memo}` : `Transfer to ${toAccount.nickname || toAccount.accountNumber}`,
    amount: -rounded,
    type: 'debit',
    category: 'Transfer',
    balanceAfter: fromAccount.balance
  };
  const creditTx = {
    id: db.nextId(),
    accountId: toAccount.id,
    date: now,
    description: memo ? `Transfer from ${fromAccount.nickname || fromAccount.accountNumber}: ${memo}` : `Transfer from ${fromAccount.nickname || fromAccount.accountNumber}`,
    amount: rounded,
    type: 'credit',
    category: 'Transfer',
    balanceAfter: toAccount.balance
  };

  state.transactions.push(debitTx, creditTx);
  db.save();

  res.status(201).json({
    transfer: {
      id: debitTx.id,
      fromAccountId: fromAccount.id,
      toAccountNumber: toAccount.accountNumber,
      amount: rounded,
      memo: memo || null,
      date: now
    },
    fromAccount
  });
});

module.exports = router;
