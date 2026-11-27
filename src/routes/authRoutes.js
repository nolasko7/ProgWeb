const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { requireLogin, soloInvitados } = require('../middlewares/sessionAuth');

// Login y registro: solo para quienes no iniciaron sesión
router.get('/register', soloInvitados, auth.metodoGet);
router.post('/register', soloInvitados, auth.metodoPost);
router.get('/login', soloInvitados, auth.loginGet);
router.post('/login', soloInvitados, auth.loginPost);

// Cerrar sesión: solo usuarios logueados
router.post('/logout', requireLogin, auth.logout);

module.exports = router;
