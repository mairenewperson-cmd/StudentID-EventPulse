const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 

describe('Announcement Endpoints', () => {

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project2web_test';
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/announcements', () => {
    it('should return 401 if request is unauthorized (missing token)', async () => {
      const res = await request(app)
        .post('/api/announcements')
        .send({
          event: '6a86d369283324cf5cb9693a',
          text: 'Test Announcement',
        });

      expect(res.statusCode).toEqual(401);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/announcements')
        .send({});

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/announcements/:eventId', () => {
    it('should return 400 if eventId parameter is an invalid ObjectId format', async () => {
      const res = await request(app).get('/api/announcements/invalid-id-123');

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });

    it('should return 200 and an array for a valid ObjectId format', async () => {
      const validObjectId = '6a86d369283324cf5cb9693a';
      const res = await request(app).get(`/api/announcements/${validObjectId}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

});