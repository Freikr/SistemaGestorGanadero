const { body, param } = require('express-validator');
const ventasService = require('../services/ventas.service');
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

async function listarVentas(req, res) {
  try {
    const ventas = await ventasService.listarVentas(req.user.finca_id);
    res.json({ success: true, data: ventas });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function obtenerVenta(req, res) {
  try {
    const venta = await ventasService.obtenerVenta(req.params.id);
    res.json({ success: true, data: venta });
  } catch (error) {
    res.status(404).json({ success: false, mensaje: error.message });
  }
}

async function crearVenta(req, res) {
  try {
    const venta = await ventasService.crearVenta(req.body, req.user.id, req.ip);
    res.status(201).json({ success: true, mensaje: 'Venta registrada correctamente', data: venta });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function actualizarVenta(req, res) {
  try {
    const venta = await ventasService.actualizarVenta(req.params.id, req.body, req.user.id, req.ip);
    res.json({ success: true, mensaje: 'Venta actualizada correctamente', data: venta });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function eliminarVenta(req, res) {
  try {
    await ventasService.eliminarVenta(req.params.id, req.user.id, req.ip);
    res.json({ success: true, mensaje: 'Venta cancelada correctamente' });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

module.exports = {
  listarVentas,
  obtenerVenta,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
  validarErrores,
  validaciones: {
    crear: [
      body('cliente').notEmpty().withMessage('El cliente es requerido'),
      body('detalles').isArray({ min: 1 }).withMessage('Debe incluir al menos un detalle'),
      body('detalles.*.animal_id').isInt().withMessage('ID de animal inválido'),
      body('detalles.*.precio_unitario').isFloat({ min: 0 }).withMessage('Precio unitario inválido'),
      body('detalles.*.subtotal').isFloat({ min: 0 }).withMessage('Subtotal inválido'),
      validarErrores,
    ],
  },
  middleware: [authMiddleware, permisosMiddleware(['ADMINISTRADOR', 'DUEÑO', 'VETERINARIO', 'EMPLEADO'])],
};
