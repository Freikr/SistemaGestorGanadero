const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

router.get('/dashboard', reportesController.middleware, reportesController.dashboard);

router.get('/animales', reportesController.middleware, reportesController.validaciones.animales, reportesController.reporteAnimales);

router.get('/movimientos', reportesController.middleware, reportesController.validaciones.movimientos, reportesController.reporteMovimientos);

router.get('/salud', reportesController.middleware, reportesController.validaciones.salud, reportesController.reporteSalud);

router.get('/ventas', reportesController.middleware, reportesController.validaciones.ventas, reportesController.reporteVentas);

router.get('/inventario', reportesController.middleware, reportesController.reporteInventario);

router.get('/mortalidad', reportesController.middleware, reportesController.reporteMortalidad);

router.get('/por-raza', reportesController.middleware, reportesController.reportePorRaza);

router.get('/por-finca', reportesController.middleware, reportesController.reportePorFinca);

router.get('/reproduccion', reportesController.middleware, reportesController.validaciones.reproduccion, reportesController.reporteReproduccion);

router.get('/poblacion', reportesController.middleware, reportesController.reportePoblacion);

router.get('/exportar/pdf', reportesController.middleware, reportesController.exportarPDF);

router.get('/exportar/excel', reportesController.middleware, reportesController.exportarExcel);

router.get('/exportar/csv', reportesController.middleware, reportesController.exportarCSV);

module.exports = router;
