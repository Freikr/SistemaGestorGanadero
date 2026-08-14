const { query } = require('express-validator');
const reportesService = require('../services/reportes.service');
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

async function dashboard(req, res) {
  try {
    const datos = await reportesService.obtenerDashboard(req.user.finca_id);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteAnimales(req, res) {
  try {
    const datos = await reportesService.obtenerReporteAnimales(req.user.finca_id);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteVentas(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const datos = await reportesService.obtenerReporteVentas(req.user.finca_id, fechaInicio, fechaFin);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteInventario(req, res) {
  try {
    const datos = await reportesService.obtenerReporteInventario(req.user.finca_id);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

module.exports = {
  dashboard,
  reporteAnimales,
  reporteVentas,
  reporteInventario,
  validarErrores,
  validaciones: {
    ventas: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      validarErrores,
    ],
  },
  middleware: [authMiddleware, permisosMiddleware(['ADMINISTRADOR', 'DUEÑO'])],
};
