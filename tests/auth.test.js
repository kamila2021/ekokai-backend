const request = require('supertest');
const app = require('../src/app');
const { connectDB1 } = require('../src/config/database');

describe('Auth endpoints', () => {
  beforeAll(async () => {
    process.env.MONGO_URI_DB1 = process.env.MONGO_URI_DB1 || 'mongodb://localhost:27017/ekokai_test';
    await connectDB1();
  });

  it('debería rechazar login con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'fake@correo.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
}); 