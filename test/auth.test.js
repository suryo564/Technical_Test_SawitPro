import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../app.js'; // Add .js if the extension is missing in the imports
import db from '../config/db.js';
import User from '../models/User.js';

const { expect } = chai;
chai.use(chaiHttp);
const request = supertest(app);

describe('Auth Routes', () => {
  before(async () => {
    // Clear the users table before tests
    await db.query('DELETE FROM users');
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request.post('/register').send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
        confirm_password: 'password'
      });

      expect(res).to.have.status(302);
      expect(res).to.redirectTo(/\/upload$/);
    });

    it('should not register a user with an existing email', async () => {
      const res = await request.post('/register').send({
        username: 'testuser2',
        email: 'testuser@example.com',
        password: 'password',
        confirm_password: 'password'
      });

      expect(res).to.have.status(400);
      expect(res.body.errors).to.exist;
      expect(res.body.errors[0].msg).to.equal('User already exists');
    });
  });

  describe('POST /login', () => {
    it('should login a registered user', async () => {
      const res = await request.post('/login').send({
        email: 'testuser@example.com',
        password: 'password'
      });

      expect(res).to.have.status(302);
      expect(res).to.redirectTo(/\/upload$/);
    });

    it('should not login with incorrect credentials', async () => {
      const res = await request.post('/login').send({
        email: 'testuser@example.com',
        password: 'wrongpassword'
      });

      expect(res).to.have.status(400);
      expect(res.body.errors).to.exist;
      expect(res.body.errors[0].msg).to.equal('Invalid credentials');
    });
  });

  describe('GET /logout', () => {
    it('should logout the user', async () => {
      const res = await request.get('/logout');

      expect(res).to.have.status(302);
      expect(res).to.redirectTo(/\/login$/);
    });
  });
});
