const express = require('express');
const router = express.Router();
const configuracionController = require('../controllers/configuracion.controller');

router.get('/', configuracionController.middleware, configuracionController.obtenerConfiguracion);
router.put('/', configuracionController.middleware, configuracionController.validaciones.actualizar, configuracionController.actualizarConfiguracion);

module.exports = router;
