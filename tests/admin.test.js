const request = require('supertest');
const app = require('../src/app');
const { connectDB1 } = require('../src/config/database');

const ADMIN_EMAIL = 'admin@correo.com';
const ADMIN_PASS = 'admin123';
const ADMIN_DNI = '00000000';

describe('Admin endpoints', () => {
  let token;
  let premioId;

  beforeAll(async () => {
    process.env.MONGO_URI_DB1 = process.env.MONGO_URI_DB1 || 'mongodb://localhost:27017/ekokai_test';
    await connectDB1();
    // Crea admin si no existe
    try {
      await request(app)
        .post('/usuarios/registrar')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASS, rol: 'administrador', nombre: 'Admin', dni: ADMIN_DNI });
    } catch {}
    const res = await request(app)
      .post('/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASS });
    token = res.body.token;
  });

  it('debería listar usuarios', async () => {
    const res = await request(app)
      .get('/admin/usuarios')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Puedes agregar más tests para historialUsuario, metricasEcopunto, premios CRUD
}); 