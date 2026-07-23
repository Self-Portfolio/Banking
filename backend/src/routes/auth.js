const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken, requireAuth, TOKEN_TTL_SECONDS } = require('../middleware/auth');

const router = express.Router();

function publicUser(u) {
  return { id: u.id, username: u.username, email: u.email, fullName: u.fullName };
}

router.post('/register', (req, res) => {
  const { username, email, password, fullName } = req.body || {};
  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ error: 'username, email, password, and fullName are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  const state = db.state;
  const exists = state.users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return res.status(409).json({ error: 'Username or email already registered' });
  }
  const user = {
    id: db.nextId(),
    username,
    email,
    passwordHash: bcrypt.hashSync(password, 8),
    fullName,
    createdAt: new Date().toISOString()
  };
  state.users.push(user);

  // New users start with a single checking account, zero-balance
  const account = {
    id: db.nextId(),
    userId: user.id,
    type: 'checking',
    accountNumber: String(1000000000 + user.id),
    nickname: 'Everyday Checking',
    balance: 0
  };
  state.accounts.push(account);
  db.save();

  const token = signToken(user);
  res.status(201).json({ token, expiresIn: TOKEN_TTL_SECONDS, user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  const state = db.state;
  const user = state.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const token = signToken(user);
  res.json({ token, expiresIn: TOKEN_TTL_SECONDS, user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  const user = db.state.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

module.exports = router;
