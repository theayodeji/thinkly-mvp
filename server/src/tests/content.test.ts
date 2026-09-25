import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Space from '../models/Space.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

describe('Content Endpoints (Spaces)', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Test Content User',
      email: 'content@example.com',
      password: 'password123'
    });
    userId = user.id;
    token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '1h' });
  });

  describe('GET /api/spaces', () => {
    it('should return empty list if user has no spaces', async () => {
      const res = await request(app)
        .get('/api/spaces')
        .set('Cookie', [`accessToken=${token}`]);
        
      expect(res.status).toBe(200);
      expect(res.body.spaces).toEqual([]);
    });

    it('should return spaces if user has them', async () => {
      await Space.create({ userId, title: 'My Space', content: 'hello' });
      
      const res = await request(app)
        .get('/api/spaces')
        .set('Cookie', [`accessToken=${token}`]);
        
      expect(res.status).toBe(200);
      expect(res.body.spaces).toHaveLength(1);
      expect(res.body.spaces[0].title).toBe('My Space');
    });
    
    it('should fail without token', async () => {
      const res = await request(app).get('/api/spaces');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/spaces', () => {
    it('should create a new space', async () => {
      const res = await request(app)
        .post('/api/spaces/create')
        .set('Cookie', [`accessToken=${token}`]);
        
      expect(res.status).toBe(200);
      expect(res.body.space.title).toMatch(/Untitled Space/);
      expect(res.body.space.userId.toString()).toBe(userId);
    });
  });
});
