import request from 'supertest';
import app from '../index.js';

describe('API Routes', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Welcome');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/items', () => {
    it('should return all items', async () => {
      const res = await request(app).get('/api/v1/items');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/items/:id', () => {
    it('should return a single item', async () => {
      const res = await request(app).get('/api/v1/items/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id', 1);
    });

    it('should return 404 for non-existent item', async () => {
      const res = await request(app).get('/api/v1/items/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/items', () => {
    it('should create a new item', async () => {
      const res = await request(app)
        .post('/api/v1/items')
        .send({
          name: 'Test Item',
          description: 'Test Description'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('name', 'Test Item');
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/v1/items')
        .send({
          description: 'Test Description'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });
});