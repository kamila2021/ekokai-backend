const cuponService = require('../services/cupon.service');

const crearCupon = async (req, res) => {
  try {
    const cupon = await cuponService.crearCupon(req.body);
    res.status(201).json(cupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listarCupones = async (req, res) => {
  try {
    const cupones = await cuponService.listarCupones();
    res.json(cupones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarCupon = async (req, res) => {
  try {
    const cupon = await cuponService.actualizarCupon(req.params.id, req.body);
    res.json(cupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const eliminarCupon = async (req, res) => {
  try {
    await cuponService.eliminarCupon(req.params.id);
    res.json({ mensaje: 'Cupon eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { crearCupon, listarCupones, actualizarCupon, eliminarCupon }; 