require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI_DB1 || 'mongodb://localhost:27017/ekokai_test';

const usuarioSchema = new mongoose.Schema({
  rol: String,
  nombre: String,
  apellido: String,
  dni: String,
  email: { type: String, unique: true },
  password: String,
  fechaNacimiento: Date,
  telefono: String,
  pais: String,
  zona: String,
  direccion: String,
  tokensAcumulados: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },
  ultimaModificacion: { type: Date, default: Date.now },
  ultimaConexion: { type: Date, default: Date.now },
  ecopuntoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ecopunto',
    default: null,
  },
  requiereCambioPassword: { type: Boolean, default: false }
});

async function crearAdmin() {
  await mongoose.connect(MONGO_URI);
  const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');
  const email = 'admin@correo.com';
  const password = await bcrypt.hash('admin123', 10);
  const dni = '00000000';
  const existe = await Usuario.findOne({ email });
  if (existe) {
    console.log('[SETUP] Admin ya existe.');
    await mongoose.disconnect();
    return;
  }
  await Usuario.create({
    email,
    password,
    rol: 'administrador',
    nombre: 'Admin',
    dni
  });
  console.log('[SETUP] Admin creado correctamente.');
  await mongoose.disconnect();
}

crearAdmin(); 