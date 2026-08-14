const { body, validationResult } = require('express-validator');
const authService = require('../services/usuarios.service');

function validarErrores(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      mensaje: 'Errores de validación',
      errores: errores.array().map((err) => err.msg),
    });
  }
  next();
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const resultado = await authService.login(email, password);

    res.json({
      success: true,
      mensaje: 'Inicio de sesión exitoso',
      data: resultado,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: error.message,
    });
  }
}

async function register(req, res) {
  try {
    const usuario = await authService.register(req.body);

    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado correctamente',
      data: usuario,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: error.message,
    });
  }
}

function me(req, res) {
  res.json({
    success: true,
    data: req.user,
  });
}

function logout(req, res) {
  res.json({
    success: true,
    mensaje: 'Sesión cerrada correctamente',
  });
}

module.exports = {
  login,
  register,
  me,
  logout,
  validarErrores,
  validarLogin: [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    validarErrores,
  ],
  validarRegister: [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').optional().isIn(['ADMINISTRADOR', 'DUEÑO', 'VETERINARIO', 'EMPLEADO']),
    validarErrores,
  ],
};
