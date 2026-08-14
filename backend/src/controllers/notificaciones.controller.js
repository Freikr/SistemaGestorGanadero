const { query, param } = require('express-validator');
const notificacionesService = require('../services/notificaciones.service');
const authMiddleware = require('../middleware/auth');
const permisosMiddleware = require('../middleware/permisos');

function validarErrores(req, res, next) {
  const errores = require('express-validator').validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      mensaje: 'Errores de validación',
      errores: errores.array().map((err) => err.msg),
    });
  }
  next();
}

async function listarNotificaciones(req, res) {
  try {
    const { leida } = req.query;
    const notificaciones = await notificacionesService.listarNotificaciones(req.user.id, leida === 'true' ? true : leida === 'false' ? false : null);
    res.json({ success: true, data: notificaciones });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function marcarComoLeida(req, res) {
  try {
    const notificacion = await notificacionesService.marcarComoLeida(req.params.id, req.user.id);
    res.json({ success: true, mensaje: 'Notificación marcada como leída', data: notificacion });
  } catch (error) {
    res.status(404).json({ success: false, mensaje: error.message });
  }
}

async function marcarTodasComoLeidas(req, res) {
  try {
    await notificacionesService.marcarTodasComoLeidas(req.user.id);
    res.json({ success: true, mensaje: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function contarNoLeidas(req, res) {
  try {
    const cantidad = await notificacionesService.contarNoLeidas(req.user.id);
    res.json({ success: true, data: { cantidad } });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

module.exports = {
  listarNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
  contarNoLeidas,
  validarErrores,
  validaciones: {
    leida: [query('leida').optional().isBoolean().withMessage('El parámetro leida debe ser booleano'), validarErrores],
  },
  middleware: [authMiddleware],
};
