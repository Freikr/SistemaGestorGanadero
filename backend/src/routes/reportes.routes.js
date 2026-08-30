const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

router.get('/dashboard', reportesController.middleware, reportesController.dashboard);

router.get('/livestock', reportesController.middleware, reportesController.validaciones.animales, reportesController.reporteAnimales);

router.get('/livestock-movements', reportesController.middleware, reportesController.validaciones.movimientos, reportesController.reporteMovimientos);

router.get('/health', reportesController.middleware, reportesController.validaciones.salud, reportesController.reporteSalud);

router.get('/vaccinations', reportesController.middleware, reportesController.validaciones.vacunas, reportesController.reporteVacunas);

router.get('/sales', reportesController.middleware, reportesController.validaciones.ventas, reportesController.reporteVentas);

router.get('/income', reportesController.middleware, reportesController.reporteIngresos);

router.get('/inventory', reportesController.middleware, reportesController.reporteInventario);

router.get('/mortality', reportesController.middleware, reportesController.validaciones.mortalidad, reportesController.reporteMortalidad);

router.get('/herd-history', reportesController.middleware, reportesController.validaciones.poblacion, reportesController.reportePoblacion);

router.get('/breeds', reportesController.middleware, reportesController.reportePorRaza);

router.get('/farms', reportesController.middleware, reportesController.reportePorFinca);

router.get('/paddocks', reportesController.middleware, reportesController.reportePorPotrero);

router.get('/reproduction', reportesController.middleware, reportesController.validaciones.reproduccion, reportesController.reporteReproduccion);

router.get('/export/pdf', reportesController.middleware, reportesController.exportarPDF);

router.get('/export/excel', reportesController.middleware, reportesController.exportarExcel);

router.get('/export/csv', reportesController.middleware, reportesController.exportarCSV);

module.exports = router;
