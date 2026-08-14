const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Usuario } = require('../models/Usuario');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token de acceso requerido',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwtSecret);

    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no encontrado',
      });
    }

    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido o expirado',
    });
  }
}

module.exports = authMiddleware;
