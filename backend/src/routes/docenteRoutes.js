
const express = require('express');
const router = express.Router();

const {
    obtenerIncidenciasDisponibles,
    obtenerIncidenciasAsignadas,
    tomarIncidencia,
    actualizarEstadoIncidencia,
    obtenerSeguimientoDocente
} = require('../controllers/docenteController');

const {
    verificarToken,
    verificarRol
} = require('../middleware/authMiddleware');

router.use(verificarToken, verificarRol('docente'));

router.get('/incidencias/disponibles', obtenerIncidenciasDisponibles);
router.get('/incidencias/asignadas', obtenerIncidenciasAsignadas);

router.post('/incidencias/:id/tomar', tomarIncidencia);

router.put('/incidencias/:id/estado', actualizarEstadoIncidencia);
router.get('/incidencias/:id/seguimiento', obtenerSeguimientoDocente);

module.exports = router;
