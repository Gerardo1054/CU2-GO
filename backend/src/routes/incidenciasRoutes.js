
const express = require('express');

const router = express.Router();

const {
    crearIncidencia,
    obtenerMisIncidencias,
    obtenerIncidenciaPorId,
    eliminarMiIncidencia,
    obtenerEvidencia
} = require('../controllers/incidenciasController');

const {
    verificarToken,
    verificarRol
} = require('../middleware/authMiddleware');

const uploadEvidencia = require('../middleware/uploadEvidencia');

// Crear incidencia: solo alumnos y docentes
router.post(
    '/',
    verificarToken,
    verificarRol('alumno', 'docente'),
    uploadEvidencia.single('evidencia'),
    crearIncidencia
);

// Consultar evidencia: alumnos y administradores
router.get(
    '/:id/evidencia',
    verificarToken,
    obtenerEvidencia
);

// Consultar incidencias propias: solo alumnos
router.get(
    '/mis-incidencias',
    verificarToken,
    verificarRol('alumno'),
    obtenerMisIncidencias
);

// Eliminar reporte propio: solo alumnos
router.delete(
    '/:id',
    verificarToken,
    verificarRol('alumno'),
    eliminarMiIncidencia
);

// Consultar detalle: solo alumnos
router.get(
    '/:id',
    verificarToken,
    verificarRol('alumno'),
    obtenerIncidenciaPorId
);

module.exports = router;
