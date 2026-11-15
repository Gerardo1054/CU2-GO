const express = require('express');

const router = express.Router();

const {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion
} = require('../controllers/authController');

const {
    verificarToken
} = require('../middleware/authMiddleware');

const {
    limiteLogin,
    limiteRegistro
} = require('../middleware/rateLimitMiddleware');

router.post('/registro', limiteRegistro, registrarUsuario);

router.post('/login', limiteLogin, iniciarSesion);

router.post('/logout', verificarToken, cerrarSesion);

router.get('/perfil', verificarToken, (req, res) => {
    res.json({
        mensaje: 'Acceso autorizado',
        usuario: req.usuario
    });
});

module.exports = router;
