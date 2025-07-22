const request = require('supertest');
const app = require('../src/app');
const { connectDB1 } = require('../src/config/database');

const ADMIN_EMAIL = 'admin@correo.com';
const ADMIN_PASS = 'admin123';
const ADMIN_DNI = '00000000';

describe('Usuarios endpoints', () => {
  let token;
  let userId;

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

  it('debería listar usuarios (requiere token)', async () => {
    console.log('[TEST] Listando usuarios...');
    const res = await request(app)
      .get('/usuarios')
      .set('Authorization', `Bearer ${token}`);
    console.log('[TEST] Respuesta listar usuarios:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debería crear un usuario vecino', async () => {
    console.log('[TEST] Creando usuario vecino...');
    const res = await request(app)
      .post('/usuarios/registrar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Test',
        apellido: 'Vecino',
        email: 'vecino@correo.com',
        dni: '12345678',
        password: 'test123',
        rol: 'vecino'
      });
    console.log('[TEST] Respuesta crear vecino:', res.statusCode, res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.usuario).toBeDefined();
    userId = res.body.usuario._id;
  });

  it('debería obtener un usuario por ID', async () => {
    console.log('[TEST] Obteniendo usuario por ID:', userId);
    const res = await request(app)
      .get(`/usuarios/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    console.log('[TEST] Respuesta obtener usuario:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(userId);
  });

  it('debería actualizar un usuario', async () => {
    console.log('[TEST] Actualizando usuario:', userId);
    const res = await request(app)
      .put(`/usuarios/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Vecino Actualizado' });
    console.log('[TEST] Respuesta actualizar usuario:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Vecino Actualizado');
  });

  it('debería eliminar un usuario', async () => {
    console.log('[TEST] Eliminando usuario:', userId);
    const res = await request(app)
      .delete(`/usuarios/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    console.log('[TEST] Respuesta eliminar usuario:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBeDefined();
  });
}); 