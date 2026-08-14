const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventas.controller');

router.get('/', ventasController.middleware, ventasController.listarVentas);
router.get('/:id', ventasController.middleware, ventasController.obtenerVenta);
router.post('/', ventasController.middleware, ventasController.validaciones.crear, ventasController.crearVenta);
router.put('/:id', ventasController.middleware, ventasController.actualizarVenta);
router.delete('/:id', ventasController.middleware, ventasController.eliminarVenta);

module.exports = router;
