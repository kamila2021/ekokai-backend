const request = require('supertest');
const app = require('../src/app');
const { connectDB1 } = require('../src/config/database');

const ADMIN_EMAIL = 'admin@correo.com';
const ADMIN_PASS = 'admin123';
const ADMIN_DNI = '00000000';

describe('Ecopuntos endpoints', () => {
  let token;
  let ecopuntoId;

  beforeAll(async () => {
    process.env.MONGO_URI_DB1 = process.env.MONGO_URI_DB1 || 'mongodb://localhost:27017/ekokai_test';
    await connectDB1();
    // Intenta crear el admin (ignora error si ya existe)
    try {
      console.log('[TEST] Creando usuario admin de test...');
      await request(app)
        .post('/usuarios/registrar')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASS, rol: 'administrador', nombre: 'Admin', dni: ADMIN_DNI });
    } catch (e) {
      console.log('[TEST] Admin ya existe o error al crear:', e.message);
    }
    // Loguea para obtener token
    const res = await request(app)
      .post('/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASS });
    token = res.body.token;
    console.log('[TEST] Token obtenido:', token ? 'OK' : 'FAIL');
  });

  it('debería crear un ecopunto', async () => {
    console.log('[TEST] Creando ecopunto...');
    const res = await request(app)
      .post('/ecopuntos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Ecopunto Test', direccion: 'Calle Falsa 123' });
    console.log('[TEST] Respuesta crear ecopunto:', res.statusCode, res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();
    ecopuntoId = res.body._id;
  });

  it('debería listar ecopuntos', async () => {
    console.log('[TEST] Listando ecopuntos...');
    const res = await request(app)
      .get('/ecopuntos')
      .set('Authorization', `Bearer ${token}`);
    console.log('[TEST] Respuesta listar ecopuntos:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Puedes agregar más tests para enrolar encargado, etc.
}); 