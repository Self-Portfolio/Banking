const bcrypt = require('bcryptjs');
const db = require('./db');

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seed() {
  const state = { users: [], accounts: [], transactions: [], payees: [], nextId: 1 };

  const nextId = () => {
    const id = state.nextId;
    state.nextId += 1;
    return id;
  };

  // Demo user
  const userId = nextId();
  state.users.push({
    id: userId,
    username: 'jdoe',
    email: 'jdoe@example.com',
    passwordHash: bcrypt.hashSync('Password123!', 8),
    fullName: 'Jane Doe',
    createdAt: daysAgo(400)
  });

  // A second demo user, useful for "transfer to another user" style test cases
  const userId2 = nextId();
  state.users.push({
    id: userId2,
    username: 'msmith',
    email: 'msmith@example.com',
    passwordHash: bcrypt.hashSync('Password123!', 8),
    fullName: 'Mark Smith',
    createdAt: daysAgo(300)
  });

  const checkingId = nextId();
  state.accounts.push({
    id: checkingId,
    userId,
    type: 'checking',
    accountNumber: '1000200030',
    nickname: 'Everyday Checking',
    balance: 4250.75
  });

  const savingsId = nextId();
  state.accounts.push({
    id: savingsId,
    userId,
    type: 'savings',
    accountNumber: '1000200031',
    nickname: 'High-Yield Savings',
    balance: 12800.0
  });

  const otherAccountId = nextId();
  state.accounts.push({
    id: otherAccountId,
    userId: userId2,
    type: 'checking',
    accountNumber: '2000300040',
    nickname: 'Mark\'s Checking',
    balance: 900.0
  });

  // Transaction history for checking account
  const checkingTx = [
    { desc: 'Payroll Deposit - Acme Corp', amount: 2100.0, type: 'credit', category: 'Income', days: 28 },
    { desc: 'Rent Payment', amount: -1200.0, type: 'debit', category: 'Housing', days: 27 },
    { desc: 'Grocery Store Purchase', amount: -85.32, type: 'debit', category: 'Groceries', days: 24 },
    { desc: 'Electric Company Bill Pay', amount: -110.45, type: 'debit', category: 'Utilities', days: 20 },
    { desc: 'Coffee Shop', amount: -6.75, type: 'debit', category: 'Dining', days: 18 },
    { desc: 'Transfer to Savings', amount: -500.0, type: 'debit', category: 'Transfer', days: 15 },
    { desc: 'Gas Station', amount: -42.1, type: 'debit', category: 'Transportation', days: 12 },
    { desc: 'Online Retailer Purchase', amount: -63.99, type: 'debit', category: 'Shopping', days: 9 },
    { desc: 'Payroll Deposit - Acme Corp', amount: 2100.0, type: 'credit', category: 'Income', days: 5 },
    { desc: 'Restaurant', amount: -54.2, type: 'debit', category: 'Dining', days: 3 },
    { desc: 'Streaming Subscription', amount: -15.99, type: 'debit', category: 'Entertainment', days: 2 },
    { desc: 'Grocery Store Purchase', amount: -97.14, type: 'debit', category: 'Groceries', days: 1 }
  ];

  let runningBalance = 0;
  // compute starting balance by working backwards from final known balance
  const totalDelta = checkingTx.reduce((s, t) => s + t.amount, 0);
  runningBalance = 4250.75 - totalDelta;

  checkingTx.forEach((t) => {
    runningBalance += t.amount;
    state.transactions.push({
      id: nextId(),
      accountId: checkingId,
      date: daysAgo(t.days),
      description: t.desc,
      amount: t.amount,
      type: t.type,
      category: t.category,
      balanceAfter: Math.round(runningBalance * 100) / 100
    });
  });

  // Savings transactions
  const savingsTx = [
    { desc: 'Transfer from Checking', amount: 500.0, type: 'credit', category: 'Transfer', days: 15 },
    { desc: 'Interest Payment', amount: 21.4, type: 'credit', category: 'Interest', days: 1 }
  ];
  let savingsRunning = 12800.0 - savingsTx.reduce((s, t) => s + t.amount, 0);
  savingsTx.forEach((t) => {
    savingsRunning += t.amount;
    state.transactions.push({
      id: nextId(),
      accountId: savingsId,
      date: daysAgo(t.days),
      description: t.desc,
      amount: t.amount,
      type: t.type,
      category: t.category,
      balanceAfter: Math.round(savingsRunning * 100) / 100
    });
  });

  // Payees for bill pay
  state.payees.push({
    id: nextId(),
    userId,
    name: 'Electric Company',
    accountNumber: 'ELEC-88213',
    category: 'Utilities'
  });
  state.payees.push({
    id: nextId(),
    userId,
    name: 'City Water Utility',
    accountNumber: 'WATER-44120',
    category: 'Utilities'
  });
  state.payees.push({
    id: nextId(),
    userId,
    name: 'Acme Credit Card',
    accountNumber: 'CC-90311',
    category: 'Credit Card'
  });

  db.reset(state);
  console.log('Database seeded.');
  console.log('Demo login: username "jdoe", password "Password123!"');
  console.log('Second user: username "msmith", password "Password123!"');
}

if (require.main === module) {
  seed();
}

module.exports = seed;
