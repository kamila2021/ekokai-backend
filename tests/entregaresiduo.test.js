const request = require('supertest');
const app = require('../src/app');
const { connectDB1 } = require('../src/config/database');

describe('Entregas de residuo endpoints', () => {
  let token;
  let entregaId;
  let userId;
  let ecopuntoId;
  let tipoResiduoId;

  beforeAll(async () => {
    process.env.MONGO_URI_DB1 = process.env.MONGO_URI_DB1 || 'mongodb://localhost:27017/ekokai_test';
    await connectDB1();
    // Crea un usuario admin y loguea para obtener token
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@correo.com', password: 'admin123' });
    token = res.body.token;
    // Aquí deberías crear usuario, ecopunto y tipoResiduo de prueba y guardar sus IDs
  });

  it('debería registrar una entrega', async () => {
    // Debes tener userId, ecopuntoId, tipoResiduoId válidos
    // const res = await request(app)
    //   .post('/residuos')
    //   .set('Authorization', `Bearer ${token}`)
    //   .send({ usuarioId, ecopuntoId, tipoResiduoId, pesoKg: 2 });
    // expect(res.statusCode).toBe(201);
    // expect(res.body._id).toBeDefined();
    // entregaId = res.body._id;
  });

  it('debería obtener historial de entregas de un usuario', async () => {
    // const res = await request(app)
    //   .get(`/residuos/usuario/${userId}`)
    //   .set('Authorization', `Bearer ${token}`);
    // expect(res.statusCode).toBe(200);
    // expect(Array.isArray(res.body)).toBe(true);
  });
}); 