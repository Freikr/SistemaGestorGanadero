const { body } = require('express-validator');
const configuracionService = require('../services/configuracion.service');
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

async function obtenerConfiguracion(req, res) {
  try {
    const configuracion = await configuracionService.obtenerConfiguracion(req.user.finca_id);
    res.json({ success: true, data: configuracion });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function actualizarConfiguracion(req, res) {
  try {
    const configuracion = await configuracionService.actualizarConfiguracion(req.user.finca_id, req.body, req.user.id, req.ip);
    res.json({ success: true, mensaje: 'Configuración actualizada correctamente', data: configuracion });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
  validarErrores,
  validaciones: {
    actualizar: [
      body('moneda').optional().isString().isLength({ max: 10 }),
      body('unidad_peso').optional().isString().isLength({ max: 10 }),
      body('unidad_superficie').optional().isString().isLength({ max: 10 }),
      body('formato_fecha').optional().isString().isLength({ max: 20 }),
      body('zona_horaria').optional().isString().isLength({ max: 50 }),
      body('notificaciones_activadas').optional().isBoolean(),
      body('alertas_stock').optional().isBoolean(),
      validarErrores,
    ],
  },
  middleware: [authMiddleware, permisosMiddleware(['ADMINISTRADOR', 'DUEÑO'])],
};
