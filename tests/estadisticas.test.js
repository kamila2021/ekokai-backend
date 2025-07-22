const request = require('supertest');
const app = require('../src/app');
const { connectDB1 } = require('../src/config/database');

const ADMIN_EMAIL = 'admin@correo.com';
const ADMIN_PASS = 'admin123';
const ADMIN_DNI = '00000000';

describe('Estadísticas endpoints', () => {
  let token;

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

  it('debería obtener el total de kilos reciclados', async () => {
    console.log('[TEST] Obteniendo total de kilos reciclados...');
    const res = await request(app)
      .get('/estadisticas/total-kilos')
      .set('Authorization', `Bearer ${token}`);
    console.log('[TEST] Respuesta total kilos:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalKg).toBeDefined();
  });

  // Puedes agregar más tests para sucursal top, kilos por mes, progreso meta mensual
}); 