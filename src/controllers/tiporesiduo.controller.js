const tipoService = require('../services/tiporesiduo.service');
const tipoRepo = require('../repositories/tiporesiduo.repository');

const crear = async (req, res) => {
  try {
    console.log('🎯 [CONTROLLER] → POST /tipos-residuo');
    const nuevoTipo = await tipoService.crearTipoResiduo(req.body);
    res.status(201).json(nuevoTipo);
  } catch (error) {
    console.error('❌ [CONTROLLER] Error al crear tipo de residuo:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const listar = async (req, res) => {
  try {
    console.log('🎯 [CONTROLLER] → GET /tipos-residuo');
    const tipos = await tipoService.obtenerTodos();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar tipos de residuo' });
  }
};

const eliminar = async (req, res) => {
  try {
    console.log('🗑️ [CONTROLLER] → DELETE /tipos-residuo/' + req.params.id);
    await tipoRepo.eliminarTipoResiduo(req.params.id);
    res.status(200).json({ mensaje: 'Tipo de residuo eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crear,
  listar,
  eliminar
};
