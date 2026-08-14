const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');

router.get('/', inventarioController.middleware, inventarioController.listarInventario);
router.get('/:id', inventarioController.middleware, inventarioController.obtenerInventario);
router.post('/', inventarioController.middleware, inventarioController.validaciones.crear, inventarioController.crearProducto);
router.put('/:id', inventarioController.middleware, inventarioController.actualizarProducto);
router.post('/movimiento', inventarioController.middleware, inventarioController.validaciones.movimiento, inventarioController.registrarMovimiento);
router.delete('/:id', inventarioController.middleware, inventarioController.eliminarProducto);

module.exports = router;
