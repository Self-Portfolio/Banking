const fs = require('fs');
const path = require('path');

const TEST_DB = path.join(__dirname, 'tmp-transfers-db.json');
process.env.DB_FILE = TEST_DB;
if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

const request = require('supertest');
const app = require('../src/index');

afterAll(() => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

let token;
let checkingAccountId;
let savingsAccountNumber;

beforeAll(async () => {
  const login = await request(app)
    .post('/api/auth/login')
    .send({ username: 'jdoe', password: 'Password123!' });
  token = login.body.token;

  const accountsRes = await request(app)
    .get('/api/accounts')
    .set('Authorization', `Bearer ${token}`);
  const checking = accountsRes.body.accounts.find((a) => a.type === 'checking');
  const savings = accountsRes.body.accounts.find((a) => a.type === 'savings');
  checkingAccountId = checking.id;
  savingsAccountNumber = savings.accountNumber;
});

describe('POST /api/transfers', () => {
  it('moves money between the user\'s own accounts', async () => {
    const before = await request(app)
      .get(`/api/accounts/${checkingAccountId}`)
      .set('Authorization', `Bearer ${token}`);
    const startBalance = before.body.account.balance;

    const res = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromAccountId: checkingAccountId, toAccountNumber: savingsAccountNumber, amount: 100 });

    expect(res.status).toBe(201);
    expect(res.body.fromAccount.balance).toBeCloseTo(startBalance - 100, 2);
  });

  it('rejects a transfer that exceeds the available balance', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromAccountId: checkingAccountId, toAccountNumber: savingsAccountNumber, amount: 999999 });
    expect(res.status).toBe(422);
  });

  it('rejects a transfer to an unknown account number', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromAccountId: checkingAccountId, toAccountNumber: '0000000000', amount: 10 });
    expect(res.status).toBe(404);
  });

  it('rejects a zero-amount transfer', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromAccountId: checkingAccountId, toAccountNumber: savingsAccountNumber, amount: 0 });
    expect(res.status).toBe(400);
  });

  it('rejects a negative-amount transfer', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromAccountId: checkingAccountId, toAccountNumber: savingsAccountNumber, amount: -50 });
    expect(res.status).toBe(400);
  });

  it('rejects an unauthenticated transfer request', async () => {
    const res = await request(app)
      .post('/api/transfers')
      .send({ fromAccountId: checkingAccountId, toAccountNumber: savingsAccountNumber, amount: 10 });
    expect(res.status).toBe(401);
  });
});
