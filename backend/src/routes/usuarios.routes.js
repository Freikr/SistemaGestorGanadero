const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.middleware, usuariosController.listarUsuarios);
router.get('/:id', usuariosController.middleware, usuariosController.obtenerUsuario);
router.post('/', usuariosController.middleware, usuariosController.validaciones.crear, usuariosController.crearUsuario);
router.put('/:id', usuariosController.middleware, usuariosController.validaciones.actualizar, usuariosController.actualizarUsuario);
router.delete('/:id', usuariosController.middleware, usuariosController.eliminarUsuario);

module.exports = router;
