import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../app.js';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);
const request = supertest(app);

describe('Upload Routes', () => {
  let token;

  before(async () => {
    // Clear the users table before tests
    await db.query('DELETE FROM users');

    // Create a new user
    await request.post('/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
      confirm_password: 'password'
    });

    // Login to get the token
    const res = await request.post('/login').send({
      email: 'testuser@example.com',
      password: 'password'
    });

    token = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  describe('POST /upload', () => {
    it('should upload a file', async () => {
      const res = await request.post('/upload')
        .set('Cookie', `token=${token}`)
        .attach('file', 'test/fixtures/testfile.png');

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('File uploaded successfully');
    });

    it('should not upload a file without authentication', async () => {
      const res = await request.post('/upload')
        .attach('file', 'test/fixtures/testfile.png');

      expect(res).to.have.status(302);
      expect(res).to.redirectTo(/\/login$/);
    });

    it('should not upload a file with invalid file type', async () => {
      const res = await request.post('/upload')
        .set('Cookie', `token=${token}`)
        .attach('file', 'test/fixtures/testfile.exe');

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('File type not allowed');
    });
  });
});
