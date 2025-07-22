const entregaRepo = require('../repositories/entregaresiduio.repository');
const usuarioRepo = require('../repositories/usuario.repository');
const tipoRepo = require('../repositories/tiporesiduo.repository');

const registrarEntrega = async ({ usuarioId, ecopuntoId, tipoResiduoId, pesoKg }) => {
  console.log('🟡 [SERVICE] Iniciando registro de entrega...');

  const tipo = await tipoRepo.buscarPorId(tipoResiduoId);
  if (!tipo) throw new Error('Tipo de residuo no encontrado');

  // Redondeo especial: 0.5kg o más es 1kg, menos de 0.5 es 0
  const pesoRedondeado = pesoKg >= 0.5 ? 1 : 0;
  const tokens = Math.round(tipo.tokensPorKg * pesoRedondeado);
  console.log(`🧮 Tokens otorgados: ${tokens} (${tipo.tokensPorKg} x ${pesoRedondeado})`);

  const entrega = await entregaRepo.crearEntrega({
    usuario: usuarioId,
    ecopunto: ecopuntoId,
    tipoResiduo: tipoResiduoId,
    pesoKg,
    tokensOtorgados: tokens
  });

  console.log('📌 [SERVICE] Entrega guardada correctamente');

  await usuarioRepo.incrementarTokens(usuarioId, tokens);

  return entrega;
};

const obtenerHistorialUsuario = async (usuarioId) => {
  return await entregaRepo.listarPorUsuario(usuarioId);
};

module.exports = {
  registrarEntrega,
  obtenerHistorialUsuario
};
