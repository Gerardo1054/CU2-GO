const express = require('express');
const router = express.Router();

const {
    obtenerCatalogoEspacios,
    obtenerRecursosPorSalon,
    crearRecurso
} = require('../controllers/recursosController');

const {
    verificarToken,
    verificarRol
} = require('../middleware/authMiddleware');

// Todas las rutas requieren iniciar sesión
router.use(verificarToken);

// Consultar edificios y salones
router.get('/espacios', obtenerCatalogoEspacios);

// Consultar recursos de un salón
router.get('/', obtenerRecursosPorSalon);

// Registrar recursos: únicamente administradores
router.post(
    '/',
    verificarRol('administrador'),
    crearRecurso
);

module.exports = router;