function permisosMiddleware(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado',
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permisos para realizar esta acción',
      });
    }

    next();
  };
}

module.exports = permisosMiddleware;
