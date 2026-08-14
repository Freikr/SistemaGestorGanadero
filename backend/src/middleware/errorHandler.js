const config = require('../config/config');

function errorHandler(error, req, res, next) {
  console.error('Error:', error);

  if (error.name === 'SequelizeValidationError') {
    const mensajes = error.errors.map((err) => err.message);
    return res.status(400).json({
      success: false,
      mensaje: 'Error de validación',
      errores: mensajes,
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      mensaje: 'El registro ya existe',
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      mensaje: 'Token expirado',
    });
  }

  const statusCode = error.statusCode || 500;
  const mensaje = error.mensaje || 'Error interno del servidor';

  return res.status(statusCode).json({
    success: false,
    mensaje: config.nodeEnv === 'production' ? mensaje : error.message,
  });
}

module.exports = errorHandler;
