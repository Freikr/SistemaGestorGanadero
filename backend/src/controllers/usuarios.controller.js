const { body, param } = require('express-validator');
const usuariosService = require('../services/usuarios.service');
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

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuariosService.listarUsuarios();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function obtenerUsuario(req, res) {
  try {
    const usuario = await usuariosService.obtenerUsuarioPorId(req.params.id);
    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(404).json({ success: false, mensaje: error.message });
  }
}

async function crearUsuario(req, res) {
  try {
    const usuario = await usuariosService.crearUsuario(req.body, req.user.id, req.ip);
    res.status(201).json({ success: true, mensaje: 'Usuario creado correctamente', data: usuario });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const usuario = await usuariosService.actualizarUsuario(req.params.id, req.body, req.user.id, req.ip);
    res.json({ success: true, mensaje: 'Usuario actualizado correctamente', data: usuario });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function eliminarUsuario(req, res) {
  try {
    await usuariosService.eliminarUsuario(req.params.id, req.user.id, req.ip);
    res.json({ success: true, mensaje: 'Usuario desactivado correctamente' });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  validarErrores,
  validaciones: {
    crear: [
      body('nombre').notEmpty().withMessage('El nombre es requerido'),
      body('email').isEmail().withMessage('Correo electrónico inválido'),
      body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
      body('rol').optional().isIn(['ADMINISTRADOR', 'DUEÑO', 'VETERINARIO', 'EMPLEADO']),
      validarErrores,
    ],
    actualizar: [
      body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
      body('email').optional().isEmail().withMessage('Correo electrónico inválido'),
      body('rol').optional().isIn(['ADMINISTRADOR', 'DUEÑO', 'VETERINARIO', 'EMPLEADO']),
      validarErrores,
    ],
  },
  middleware: [authMiddleware, permisosMiddleware(['ADMINISTRADOR', 'DUEÑO'])],
};
