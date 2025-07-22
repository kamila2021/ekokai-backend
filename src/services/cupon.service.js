const cuponRepo = require('../repositories/cupon.repository');

const crearCupon = async (data) => await cuponRepo.crearCupon(data);
const listarCupones = async () => await cuponRepo.listarCupones();
const actualizarCupon = async (id, data) => await cuponRepo.actualizarCupon(id, data);
const eliminarCupon = async (id) => await cuponRepo.eliminarCupon(id);

module.exports = { crearCupon, listarCupones, actualizarCupon, eliminarCupon }; 