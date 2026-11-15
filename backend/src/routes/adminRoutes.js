
const express = require('express');
const router = express.Router();

const {
    obtenerTodasIncidencias,
    actualizarEstadoIncidencia,
    obtenerSeguimiento,
    eliminarIncidencia
} = require('../controllers/adminController');

const {
    verificarToken,
    verificarRol
} = require('../middleware/authMiddleware');

// Todas las rutas requieren sesión de administrador.
router.use(verificarToken, verificarRol('administrador'));

// Consultar todas las incidencias.
router.get('/incidencias', obtenerTodasIncidencias);

// Actualizar el estado de una incidencia.
router.put('/incidencias/:id/estado', actualizarEstadoIncidencia);

// Consultar el seguimiento de una incidencia.
router.get('/incidencias/:id/seguimiento', obtenerSeguimiento);

// Eliminar un reporte.
router.delete('/incidencias/:id', eliminarIncidencia);

module.exports = router;
