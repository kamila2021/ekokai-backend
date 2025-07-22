const request = require('supertest');
const app = require('../src/app');
const { connectDB1 } = require('../src/config/database');
const getTipoResiduoModel = require('../src/models/tiporesiduo.model');

const ADMIN_EMAIL = 'admin@correo.com';
const ADMIN_PASS = 'admin123';
const ADMIN_DNI = '00000000';

describe('Tipos de residuo endpoints', () => {
  let token;
  let tipoResiduoId;

  beforeAll(async () => {
    process.env.MONGO_URI_DB1 = process.env.MONGO_URI_DB1 || 'mongodb://localhost:27017/ekokai_test';
    await connectDB1();
    // Intenta crear el admin (ignora error si ya existe)
    try {
      await request(app)
        .post('/usuarios/registrar')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASS, rol: 'administrador', nombre: 'Admin', dni: ADMIN_DNI });
    } catch (e) {}
    // Loguea para obtener token
    const res = await request(app)
      .post('/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASS });
    token = res.body.token;
  });

  beforeEach(async () => {
    // Limpia la colección antes de cada test
    const db = require('../src/config/database').getDB1();
    const TipoResiduo = getTipoResiduoModel(db);
    await TipoResiduo.deleteMany({});
  });

  it('debería crear un tipo de residuo', async () => {
    const res = await request(app)
      .post('/tipos-residuo')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Plástico', descripcion: 'Botellas', tokensPorKg: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();
    tipoResiduoId = res.body._id;
  });

  it('debería listar tipos de residuo', async () => {
    // Crea uno para listar
    const db = require('../src/config/database').getDB1();
    const TipoResiduo = getTipoResiduoModel(db);
    const tipo = await TipoResiduo.create({ nombre: 'Vidrio', descripcion: 'Botellas', tokensPorKg: 1 });
    const res = await request(app)
      .get('/tipos-residuo')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    tipoResiduoId = res.body[0]._id;
  });

  it('debería eliminar un tipo de residuo', async () => {
    // Crea uno para eliminar
    const db = require('../src/config/database').getDB1();
    const TipoResiduo = getTipoResiduoModel(db);
    const tipo = await TipoResiduo.create({ nombre: 'Metal', descripcion: 'Latas', tokensPorKg: 3 });
    const res = await request(app)
      .delete(`/tipos-residuo/${tipo._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
}); 