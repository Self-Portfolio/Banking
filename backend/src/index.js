const express = require('express');
const cors = require('cors');
const fs = require('fs');
const db = require('./db');
const seed = require('./seed');

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const transferRoutes = require('./routes/transfers');
const payeeRoutes = require('./routes/payees');

// Auto-seed on first run so the app is usable immediately.
if (!fs.existsSync(db.DB_FILE) || db.state.users.length === 0) {
  seed();
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Convenience endpoint for test automation: resets the datastore back to
// the seeded demo data. Only exists because this is a practice app for
// writing test automation - a real bank would never expose this.
app.post('/api/test/reset', (req, res) => {
  seed();
  res.json({ status: 'reset' });
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/accounts', transactionRoutes); // adds /:id/transactions
app.use('/api/transfers', transferRoutes);
app.use('/api/payees', payeeRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Banking API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
