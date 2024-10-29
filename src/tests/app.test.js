const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let authToken;
let userId;
let accountId;
let transactionId;

beforeAll(async () => {
  await prisma.transaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should create a new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          identityType: 'KTP',
          identityNumber: '1234567890',
          address: 'Test Address'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body).toHaveProperty('data.user.id');
      userId = res.body.data.user.id;
    });

    it('should fail with duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'password123',
          identityType: 'KTP',
          identityNumber: '1234567891',
          address: 'Test Address'
        });

      expect(res.statusCode).toBe(409);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test2@example.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('required');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      authToken = res.body.data.token;
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(409);
    });
  });
});

describe('User Endpoints', () => {
  describe('GET /api/v1/users', () => {
    it('should get all users', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    it('should get user by id', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('id', userId);
    });

    it('should fail with non-existent user id', async () => {
      const res = await request(app)
        .get('/api/v1/users/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/v1/users/:userId', () => {
    it('should update user successfully', async () => {
      const res = await request(app)
        .put(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          address: 'Updated Address'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe('Updated Name');
    });

    it('should fail with non-existent user', async () => {
      const res = await request(app)
        .put('/api/v1/users/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name'
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/v1/users/:userId', () => {
    let userToDelete;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          name: 'User To Delete',
          email: 'delete@example.com',
          password: 'password123'
        }
      });
      userToDelete = user.id;
    });

    it('should delete user successfully', async () => {
      const res = await request(app)
        .delete(`/api/v1/users/${userToDelete}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should fail with non-existent user', async () => {
      const res = await request(app)
        .delete('/api/v1/users/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});

describe('Account Endpoints', () => {
  describe('GET /api/v1/accounts', () => {
    it('should get all accounts', async () => {
      const res = await request(app)
        .get('/api/v1/accounts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/accounts', () => {
    it('should create a new account successfully', async () => {
      const res = await request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          bankName: 'Test Bank',
          bankAccountNumber: '1234567890',
          balance: 1000000
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      accountId = res.body.data.id;
    });

    it('should fail with invalid balance', async () => {
      const res = await request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          bankName: 'Test Bank',
          bankAccountNumber: '1234567891',
          balance: -1000
        });

      expect(res.statusCode).toBe(400);
    });

    it('should fail with non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: 99999,
          bankName: 'Test Bank',
          bankAccountNumber: '1234567892',
          balance: 1000000
        });

      expect(res.statusCode).toBe(404);
    });

    it('should fail with duplicate account number', async () => {
      const res = await request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          bankName: 'Test Bank',
          bankAccountNumber: '1234567890', // Using existing number
          balance: 1000000
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('GET /api/v1/accounts/:accountId', () => {
    it('should get account by id', async () => {
      const res = await request(app)
        .get(`/api/v1/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('id', accountId);
    });
  });

  describe('PUT /api/v1/accounts/:accountId', () => {
    it('should update account successfully', async () => {
      const res = await request(app)
        .put(`/api/v1/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bankName: 'Updated Bank Name'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.bankName).toBe('Updated Bank Name');
    });

    it('should fail with non-existent account', async () => {
      const res = await request(app)
        .put('/api/v1/accounts/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bankName: 'Updated Bank Name'
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/v1/accounts/:accountId', () => {
    let accountToDelete;

    beforeAll(async () => {
      const account = await prisma.bankAccount.create({
        data: {
          user: { connect: { id: userId } },
          bankName: 'Account To Delete',
          bankAccountNumber: '9999888877',
          balance: 1000000
        }
      });
      accountToDelete = account.id;
    });

    it('should delete account successfully', async () => {
      const res = await request(app)
        .delete(`/api/v1/accounts/${accountToDelete}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});

describe('Transaction Endpoints', () => {
  let destinationAccountId;

  beforeAll(async () => {
    const destAccount = await prisma.bankAccount.create({
      data: {
        user: { connect: { id: userId } },
        bankName: 'Test Bank 2',
        bankAccountNumber: '9876543210',
        balance: 1000000
      }
    });
    destinationAccountId = destAccount.id;
  });

  describe('POST /api/v1/transactions', () => {
    it('should create a new transaction successfully', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sourceAccountId: accountId,
          destinationAccountId: destinationAccountId,
          amount: 100000
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      transactionId = res.body.data.id;
    });

    it('should fail with insufficient balance', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sourceAccountId: accountId,
          destinationAccountId: destinationAccountId,
          amount: 10000000
        });

      expect(res.statusCode).toBe(400);
    });

    it('should fail with same source and destination account', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sourceAccountId: accountId,
          destinationAccountId: accountId,
          amount: 100000
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toContain('Transaction created successfully');
    });

    it('should fail with zero amount', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sourceAccountId: accountId,
          destinationAccountId: destinationAccountId,
          amount: 0
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Amount must be a positive number and greater than 0');
    });
  });

  describe('GET /api/v1/transactions', () => {
    it('should get all transactions', async () => {
      const res = await request(app)
        .get('/api/v1/transactions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/transactions/:transactionId', () => {
    it('should get transaction by id', async () => {
      const res = await request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('id', transactionId);
    });

    it('should fail with non-existent transaction id', async () => {
      const res = await request(app)
        .get('/api/v1/transactions/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/v1/transactions/:transactionId', () => {
    it('should delete transaction successfully', async () => {
      const res = await request(app)
        .delete(`/api/v1/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});

describe('Auth Middleware', () => {
  it('should fail with invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid or expired token');
  });

  it('should fail with missing token', async () => {
    const res = await request(app)
      .get('/api/v1/users');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Authorization token is required');
  });

  it('should fail with malformed authorization header', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'InvalidFormat token');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid or expired token');
  });
});

describe('Error Handlers', () => {
  it('should return 404 for non-existent route', async () => {
    const res = await request(app)
      .get('/api/v1/non-existent');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Are you lost?');
  });

  it('should handle internal server errors', async () => {
    const res = await request(app)
      .get('/api/v1/test-error');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});