const request = require('supertest');
const app = require('../src/index');
const { connectDB, disconnectDB } = require('../src/config/database');

describe('API Integration Tests', () => {
  // Connect to DB before tests
  beforeAll(async () => {
    await connectDB();
  });

  // Disconnect after tests
  afterAll(async () => {
    await disconnectDB();
  });

  describe('Health Check', () => {
    it('GET /api/health should return 200 OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Security Middleware', () => {
    it('should have Rate-Limit headers', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['ratelimit-limit']).toBeDefined();
    });

    it('should have Helmet security headers', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    });
  });

  describe('Product API', () => {
    it('GET /api/products should return list of products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
