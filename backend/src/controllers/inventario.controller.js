const { body, param } = require('express-validator');
const inventarioService = require('../services/inventario.service');
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

async function listarInventario(req, res) {
  try {
    const productos = await inventarioService.listarInventario(req.user.finca_id);
    res.json({ success: true, data: productos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function obtenerInventario(req, res) {
  try {
    const producto = await inventarioService.obtenerInventario(req.params.id);
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(404).json({ success: false, mensaje: error.message });
  }
}

async function crearProducto(req, res) {
  try {
    const producto = await inventarioService.crearProducto({ ...req.body, finca_id: req.user.finca_id }, req.user.id, req.ip);
    res.status(201).json({ success: true, mensaje: 'Producto creado correctamente', data: producto });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function actualizarProducto(req, res) {
  try {
    const producto = await inventarioService.actualizarProducto(req.params.id, req.body, req.user.id, req.ip);
    res.json({ success: true, mensaje: 'Producto actualizado correctamente', data: producto });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function registrarMovimiento(req, res) {
  try {
    const { producto_id, tipo, cantidad, motivo } = req.body;
    const producto = await inventarioService.registrarMovimiento(producto_id, tipo, cantidad, motivo, req.user.id, req.ip);
    res.json({ success: true, mensaje: 'Movimiento registrado correctamente', data: producto });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function eliminarProducto(req, res) {
  try {
    await inventarioService.eliminarProducto(req.params.id, req.user.id, req.ip);
    res.json({ success: true, mensaje: 'Producto desactivado correctamente' });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

module.exports = {
  listarInventario,
  obtenerInventario,
  crearProducto,
  actualizarProducto,
  registrarMovimiento,
  eliminarProducto,
  validarErrores,
  validaciones: {
    crear: [
      body('nombre').notEmpty().withMessage('El nombre es requerido'),
      body('categoria').isIn(['MEDICAMENTO', 'VACUNA', 'ALIMENTO', 'SUPLEMENTO', 'HERRAMIENTA', 'INSUMO', 'OTRO']).withMessage('Categoría inválida'),
      body('unidad_medida').notEmpty().withMessage('La unidad de medida es requerida'),
      validarErrores,
    ],
    movimiento: [
      body('producto_id').isInt().withMessage('ID de producto inválido'),
      body('tipo').isIn(['ENTRADA', 'SALIDA', 'AJUSTE', 'CONSUMO', 'VENCIMIENTO']).withMessage('Tipo de movimiento inválido'),
      body('cantidad').isFloat({ min: 0.01 }).withMessage('Cantidad inválida'),
      validarErrores,
    ],
  },
  middleware: [authMiddleware, permisosMiddleware(['ADMINISTRADOR', 'DUEÑO', 'VETERINARIO', 'EMPLEADO'])],
};
