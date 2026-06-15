import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Note from '../models/Note.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

describe('Content Endpoints (Notes)', () => {
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

  describe('GET /api/notes', () => {
    it('should return empty list if user has no notes', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Cookie', [`accessToken=${token}`]);
        
      expect(res.status).toBe(200);
      expect(res.body.notes).toEqual([]);
    });

    it('should return notes if user has them', async () => {
      await Note.create({ userId, title: 'My Note', content: 'hello' });
      
      const res = await request(app)
        .get('/api/notes')
        .set('Cookie', [`accessToken=${token}`]);
        
      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(1);
      expect(res.body.notes[0].title).toBe('My Note');
    });
    
    it('should fail without token', async () => {
      const res = await request(app).get('/api/notes');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Cookie', [`accessToken=${token}`]);
        
      expect(res.status).toBe(200);
      expect(res.body.note.title).toMatch(/Untitled Note/);
      expect(res.body.note.userId.toString()).toBe(userId);
    });
  });
});
