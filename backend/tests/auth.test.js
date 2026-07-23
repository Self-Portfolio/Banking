const fs = require('fs');
const path = require('path');

const TEST_DB = path.join(__dirname, 'tmp-auth-db.json');
process.env.DB_FILE = TEST_DB;
if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

const request = require('supertest');
const app = require('../src/index');

afterAll(() => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

describe('POST /api/auth/login', () => {
  it('logs in the seeded demo user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'jdoe', password: 'Password123!' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('jdoe');
  });

  it('rejects an incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'jdoe', password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('rejects a login with a missing username', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'Password123!' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/register', () => {
  it('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'newuser1',
      email: 'newuser1@example.com',
      password: 'SuperSecret1!',
      fullName: 'New User'
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('rejects duplicate usernames', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'jdoe',
      email: 'someoneelse@example.com',
      password: 'SuperSecret1!',
      fullName: 'Duplicate'
    });
    expect(res.status).toBe(409);
  });

  it('rejects a password under 8 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'shortpw',
      email: 'shortpw@example.com',
      password: 'short',
      fullName: 'Short Pw'
    });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the current user when a valid token is supplied', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ username: 'jdoe', password: 'Password123!' });
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('jdoe');
  });
});
