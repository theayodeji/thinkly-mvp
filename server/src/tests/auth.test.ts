import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user and return tokens in cookies', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
        
      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.headers['set-cookie']).toBeDefined();
      
      const userInDb = await User.findOne({ email: testUser.email });
      expect(userInDb).toBeTruthy();
    });

    it('should fail if email already exists', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
        
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('should fail validation if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, password: '123' });
        
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testUser.password, salt);
      await User.create({ ...testUser, password: hashedPassword });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
        
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });
        
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });
});
