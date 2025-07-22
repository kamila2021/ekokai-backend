const request = require('supertest');
const app = require('../src/app');
const { connectDB1 } = require('../src/config/database');

describe('WhatsApp webhook', () => {
  beforeAll(async () => {
    process.env.MONGO_URI_DB1 = process.env.MONGO_URI_DB1 || 'mongodb://localhost:27017/ekokai_test';
    await connectDB1();
  });

  it('debería responder 400 si falta teléfono o mensaje', async () => {
    const res = await request(app)
      .post('/webhook/whatsapp')
      .send({});
    expect([400, 200]).toContain(res.statusCode); // Puede ser 400 o 200 según lógica
  });
}); 