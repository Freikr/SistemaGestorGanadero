const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

router.get('/dashboard', reportesController.middleware, reportesController.dashboard);
router.get('/animales', reportesController.middleware, reportesController.reporteAnimales);
router.get('/ventas', reportesController.middleware, reportesController.validaciones.ventas, reportesController.reporteVentas);
router.get('/inventario', reportesController.middleware, reportesController.reporteInventario);

module.exports = router;
