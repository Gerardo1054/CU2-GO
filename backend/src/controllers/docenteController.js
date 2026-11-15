
const db = require('../database');

// Validar el EMA seleccionado.
const obtenerEMA = async (req, res) => {
    const ema = req.get('X-Docente-EMA');

    if (!ema) {
        res.status(400).json({ mensaje: 'Debes seleccionar un EMA' });
        return null;
    }

    const [edificios] = await db.query(
        'SELECT id, nombre FROM edificios WHERE nombre = ?',
        [ema]
    );

    if (edificios.length === 0) {
        res.status(400).json({ mensaje: 'El EMA seleccionado no es válido' });
        return null;
    }

    return edificios[0];
};

// Consultar incidencias disponibles del EMA.
const obtenerIncidenciasDisponibles = async (req, res) => {
    try {
        const edificio = await obtenerEMA(req, res);
        if (!edificio) return;

        const [incidencias] = await db.query(
            `SELECT
                i.id,
                i.titulo,
                i.descripcion,
                i.categoria,
                i.estado,
                i.fecha_creacion,

                u.nombre AS creado_por,
                u.rol AS reportante_rol,

                s.nombre AS salon,
                e.nombre AS edificio,

                r.nombre AS recurso_nombre,
                r.codigo AS recurso_codigo

            FROM incidencias i
            INNER JOIN usuarios u ON i.usuario_id = u.id
            INNER JOIN salones s ON i.salon_id = s.id
            INNER JOIN edificios e ON s.edificio_id = e.id
            LEFT JOIN recursos r ON i.recurso_id = r.id

            WHERE e.id = ?
            AND i.estado = 'recibida'
            AND i.docente_id IS NULL

            ORDER BY i.fecha_creacion ASC`,
            [edificio.id]
        );

        return res.json(incidencias);

    } catch (error) {
        console.error('Error al consultar incidencias disponibles:', error.message);

        return res.status(500).json({
            mensaje: 'Error al consultar las incidencias disponibles'
        });
    }
};

// Consultar incidencias asignadas al docente.
const obtenerIncidenciasAsignadas = async (req, res) => {
    try {
        const edificio = await obtenerEMA(req, res);
        if (!edificio) return;

        const [incidencias] = await db.query(
            `SELECT
                i.id,
                i.titulo,
                i.descripcion,
                i.categoria,
                i.estado,
                i.fecha_creacion,

                u.nombre AS creado_por,
                u.rol AS reportante_rol,

                s.nombre AS salon,
                e.nombre AS edificio,

                r.nombre AS recurso_nombre,
                r.codigo AS recurso_codigo

            FROM incidencias i
            INNER JOIN usuarios u ON i.usuario_id = u.id
            INNER JOIN salones s ON i.salon_id = s.id
            INNER JOIN edificios e ON s.edificio_id = e.id
            LEFT JOIN recursos r ON i.recurso_id = r.id

            WHERE e.id = ?
            AND i.docente_id = ?

            ORDER BY i.fecha_creacion DESC`,
            [edificio.id, req.usuario.id]
        );

        return res.json(incidencias);

    } catch (error) {
        console.error('Error al consultar incidencias asignadas:', error.message);

        return res.status(500).json({
            mensaje: 'Error al consultar las incidencias asignadas'
        });
    }
};

// Tomar una incidencia disponible.
const tomarIncidencia = async (req, res) => {
    const { id } = req.params;

    try {
        const edificio = await obtenerEMA(req, res);
        if (!edificio) return;

        const [resultado] = await db.query(
            `UPDATE incidencias i
            INNER JOIN salones s ON i.salon_id = s.id
            SET i.docente_id = ?
            WHERE i.id = ?
            AND s.edificio_id = ?
            AND i.estado = 'recibida'
            AND i.docente_id IS NULL`,
            [req.usuario.id, id, edificio.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(409).json({
                mensaje: 'La incidencia ya fue asignada o no está disponible en este EMA'
            });
        }

        return res.json({
            mensaje: 'Incidencia asignada correctamente'
        });

    } catch (error) {
        console.error('Error al tomar incidencia:', error.message);

        return res.status(500).json({
            mensaje: 'Error al asignar la incidencia'
        });
    }
};

// Actualizar el estado y registrar la observación del docente.
const actualizarEstadoIncidencia = async (req, res) => {
    const { id } = req.params;
    const { estado, observacion } = req.body;

    try {
        const edificio = await obtenerEMA(req, res);
        if (!edificio) return;

        if (!['en_proceso', 'pendiente_validacion'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado solicitado no es válido'
            });
        }

        if (!observacion || !observacion.trim()) {
            return res.status(400).json({
                mensaje: 'Debes escribir una observación'
            });
        }

        const [incidencias] = await db.query(
            `SELECT i.id, i.estado
            FROM incidencias i
            INNER JOIN salones s ON i.salon_id = s.id
            WHERE i.id = ?
            AND s.edificio_id = ?
            AND i.docente_id = ?`,
            [id, edificio.id, req.usuario.id]
        );

        if (incidencias.length === 0) {
            return res.status(404).json({
                mensaje: 'La incidencia no existe o no está asignada a tu cuenta'
            });
        }

        const estadoAnterior = incidencias[0].estado;

        const transicionesPermitidas = {
            recibida: 'en_proceso',
            en_proceso: 'pendiente_validacion'
        };

        if (transicionesPermitidas[estadoAnterior] !== estado) {
            return res.status(409).json({
                mensaje: 'No se puede realizar ese cambio de estado'
            });
        }

        const [resultado] = await db.query(
            `UPDATE incidencias
            SET estado = ?
            WHERE id = ?
            AND docente_id = ?
            AND estado = ?`,
            [estado, id, req.usuario.id, estadoAnterior]
        );

        if (resultado.affectedRows === 0) {
            return res.status(409).json({
                mensaje: 'La incidencia cambió de estado. Actualiza la página.'
            });
        }

        await db.query(
            `INSERT INTO seguimiento
            (incidencia_id, usuario_id, observacion, estado_anterior, estado_nuevo)
            VALUES (?, ?, ?, ?, ?)`,
            [
                id,
                req.usuario.id,
                observacion.trim(),
                estadoAnterior,
                estado
            ]
        );

        return res.json({
            mensaje: estado === 'en_proceso'
                ? 'La atención de la incidencia ha comenzado'
                : 'La incidencia fue enviada a validación'
        });

    } catch (error) {
        console.error('Error al actualizar incidencia:', error.message);

        return res.status(500).json({
            mensaje: 'Error al actualizar la incidencia'
        });
    }
};

// Consultar el seguimiento de una incidencia asignada al docente.
const obtenerSeguimientoDocente = async (req, res) => {
    const { id } = req.params;

    try {
        const edificio = await obtenerEMA(req, res);
        if (!edificio) return;

        const [incidencias] = await db.query(
            `SELECT i.id
            FROM incidencias i
            INNER JOIN salones s ON i.salon_id = s.id
            WHERE i.id = ?
            AND s.edificio_id = ?
            AND i.docente_id = ?`,
            [id, edificio.id, req.usuario.id]
        );

        if (incidencias.length === 0) {
            return res.status(404).json({
                mensaje: 'La incidencia no existe o no está asignada a tu cuenta'
            });
        }

        const [seguimiento] = await db.query(
            `SELECT
                s.id,
                s.observacion,
                s.estado_anterior,
                s.estado_nuevo,
                s.fecha,
                u.nombre AS realizado_por
            FROM seguimiento s
            LEFT JOIN usuarios u ON s.usuario_id = u.id
            WHERE s.incidencia_id = ?
            ORDER BY s.fecha DESC`,
            [id]
        );

        return res.json(seguimiento);

    } catch (error) {
        console.error('Error al consultar seguimiento:', error.message);

        return res.status(500).json({
            mensaje: 'Error al consultar el historial de la incidencia'
        });
    }
};

module.exports = {
    obtenerIncidenciasDisponibles,
    obtenerIncidenciasAsignadas,
    tomarIncidencia,
    actualizarEstadoIncidencia,
    obtenerSeguimientoDocente
};
