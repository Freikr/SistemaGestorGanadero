const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.validarLogin, authController.login);
router.post('/register', authController.validarRegister, authController.register);
router.get('/me', authController.me);
router.post('/logout', authController.logout);

module.exports = router;
