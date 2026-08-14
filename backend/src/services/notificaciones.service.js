const { Notificacion } = require('../models');

async function listarNotificaciones(usuarioId, leida = null) {
  const where = { usuario_id: usuarioId };

  if (leida !== null) {
    where.leida = leida;
  }

  return await Notificacion.findAll({
    where,
    order: [['fecha', 'DESC']],
  });
}

async function obtenerNotificacion(id, usuarioId) {
  const notificacion = await Notificacion.findOne({
    where: { id, usuario_id: usuarioId },
  });

  if (!notificacion) {
    throw new Error('Notificación no encontrada');
  }

  return notificacion;
}

async function marcarComoLeida(id, usuarioId) {
  const notificacion = await Notificacion.findOne({
    where: { id, usuario_id: usuarioId },
  });

  if (!notificacion) {
    throw new Error('Notificación no encontrada');
  }

  await notificacion.update({ leida: true });

  return notificacion;
}

async function marcarTodasComoLeidas(usuarioId) {
  await Notificacion.update(
    { leida: true },
    { where: { usuario_id: usuarioId, leida: false } }
  );

  return true;
}

async function crearNotificacion(datos) {
  return await Notificacion.create(datos);
}

async function contarNoLeidas(usuarioId) {
  return await Notificacion.count({
    where: { usuario_id: usuarioId, leida: false },
  });
}

module.exports = {
  listarNotificaciones,
  obtenerNotificacion,
  marcarComoLeida,
  marcarTodasComoLeidas,
  crearNotificacion,
  contarNoLeidas,
};
