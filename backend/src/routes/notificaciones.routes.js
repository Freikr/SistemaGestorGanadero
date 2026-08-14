const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificaciones.controller');

router.get('/', notificacionesController.middleware, notificacionesController.validaciones.leida, notificacionesController.listarNotificaciones);
router.get('/no-leidas/cantidad', notificacionesController.middleware, notificacionesController.contarNoLeidas);
router.patch('/:id/leida', notificacionesController.middleware, notificacionesController.marcarComoLeida);
router.patch('/marcar-todas', notificacionesController.middleware, notificacionesController.marcarTodasComoLeidas);

module.exports = router;
