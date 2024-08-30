import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../app.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);
const request = supertest(app);

describe('Auth Middleware', () => {
  let token;

  before(() => {
    // Create a valid token
    const payload = { user: { id: 1 } };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should allow access with a valid token', async () => {
    const res = await request.get('/upload')
      .set('Cookie', `token=${token}`);

    expect(res).to.have.status(200);
    expect(res.text).to.include('Upload File');
  });

  it('should redirect to login without a token', async () => {
    const res = await request.get('/upload');

    expect(res).to.have.status(302);
    expect(res).to.redirectTo(/\/login$/);
  });

  it('should return 401 with an invalid token', async () => {
    const res = await request.get('/upload')
      .set('Cookie', 'token=invalidtoken');

    expect(res).to.have.status(401);
    expect(res.body.message).to.equal('Unauthorized');
  });
});
