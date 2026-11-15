const db = require('../database');

// Obtener todas las incidencias con información del reportante y dispositivo.
const obtenerTodasIncidencias = async (req, res) => {
    try {
        const [incidencias] = await db.query(`
            SELECT
                i.id,
                i.titulo,
                i.descripcion,
                i.categoria,
                i.estado,
                i.fecha_creacion,
                i.evidencia_nombre,
                i.evidencia_ruta,
                i.evidencia_tipo,

                u.nombre AS reportante,
                u.nombre AS alumno,
                u.correo,
                u.rol AS reportante_rol,

                e.nombre AS edificio,
                s.nombre AS salon,

                r.id AS recurso_id,
                r.codigo AS recurso_codigo,
                r.nombre AS recurso_nombre,
                r.tipo AS recurso_tipo

            FROM incidencias i
            INNER JOIN usuarios u
                ON i.usuario_id = u.id
            INNER JOIN salones s
                ON i.salon_id = s.id
            INNER JOIN edificios e
                ON s.edificio_id = e.id
            LEFT JOIN recursos r
                ON i.recurso_id = r.id

            ORDER BY i.fecha_creacion DESC
        `);

        return res.json(incidencias);

    } catch (error) {
        console.error('Error al consultar incidencias:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al consultar las incidencias'
        });
    }
};

// Cambiar el estado de una incidencia y registrar seguimiento.
const actualizarEstadoIncidencia = async (req, res) => {
    const { id } = req.params;
    const { estado, observacion } = req.body;

    const estadosPermitidos = [
        'recibida',
        'en_proceso',
        'arreglada'
    ];

    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
            mensaje: 'Estado no válido'
        });
    }

    if (!observacion || !observacion.trim()) {
        return res.status(400).json({
            mensaje: 'La observación es obligatoria'
        });
    }

    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        const [incidencias] = await conexion.query(
            'SELECT estado FROM incidencias WHERE id = ? FOR UPDATE',
            [id]
        );

        if (incidencias.length === 0) {
            await conexion.rollback();

            return res.status(404).json({
                mensaje: 'La incidencia no existe'
            });
        }

        const estadoAnterior = incidencias[0].estado;

        await conexion.query(
            'UPDATE incidencias SET estado = ? WHERE id = ?',
            [estado, id]
        );

        await conexion.query(
            `INSERT INTO seguimiento
            (incidencia_id, administrador_id, observacion,
             estado_anterior, estado_nuevo)
            VALUES (?, ?, ?, ?, ?)`,
            [
                id,
                req.usuario.id,
                observacion.trim(),
                estadoAnterior,
                estado
            ]
        );

        await conexion.commit();

        return res.json({
            mensaje: 'Incidencia actualizada correctamente',
            estado_anterior: estadoAnterior,
            estado_nuevo: estado
        });

    } catch (error) {
        await conexion.rollback();

        console.error('Error al actualizar incidencia:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al actualizar la incidencia'
        });

    } finally {
        conexion.release();
    }
};

// Consultar historial de seguimiento.
const obtenerSeguimiento = async (req, res) => {
    try {
        const { id } = req.params;

        const [seguimiento] = await db.query(
            `SELECT
                s.id,
                s.observacion,
                s.estado_anterior,
                s.estado_nuevo,
                s.fecha,
                COALESCE(u_docente.nombre, u_admin.nombre) AS administrador
            FROM seguimiento s
            LEFT JOIN usuarios u_admin
                ON s.administrador_id = u_admin.id
            LEFT JOIN usuarios u_docente
                ON s.usuario_id = u_docente.id
            WHERE s.incidencia_id = ?
            ORDER BY s.fecha DESC`,
            [id]
        );

        return res.json(seguimiento);

    } catch (error) {
        console.error('Error al consultar seguimiento:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al consultar el seguimiento'
        });
    }
};

// Eliminar un reporte y su historial de seguimiento.
const eliminarIncidencia = async (req, res) => {
    const { id } = req.params;
    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        const [incidencias] = await conexion.query(
            'SELECT id FROM incidencias WHERE id = ? FOR UPDATE',
            [id]
        );

        if (incidencias.length === 0) {
            await conexion.rollback();

            return res.status(404).json({
                mensaje: 'El reporte ya no existe'
            });
        }

        // Primero se elimina el historial relacionado.
        await conexion.query(
            'DELETE FROM seguimiento WHERE incidencia_id = ?',
            [id]
        );

        // Después se elimina el reporte.
        await conexion.query(
            'DELETE FROM incidencias WHERE id = ?',
            [id]
        );

        await conexion.commit();

        return res.json({
            mensaje: 'Reporte eliminado correctamente. El dispositivo está disponible nuevamente.'
        });

    } catch (error) {
        await conexion.rollback();

        console.error('Error al eliminar incidencia:', error.message);

        return res.status(500).json({
            mensaje: 'No se pudo eliminar el reporte'
        });

    } finally {
        conexion.release();
    }
};

module.exports = {
    obtenerTodasIncidencias,
    actualizarEstadoIncidencia,
    obtenerSeguimiento,
    eliminarIncidencia
};