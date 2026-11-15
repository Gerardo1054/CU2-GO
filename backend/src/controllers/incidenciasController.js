
const db = require('../database');
const fs = require('fs');
const path = require('path');

const eliminarArchivoSubido = (archivo) => {
    if (archivo && fs.existsSync(archivo.path)) {
        fs.unlinkSync(archivo.path);
    }
};

// Crear incidencia
const crearIncidencia = async (req, res) => {
    const archivoSubido = req.file;

    try {
        const {
            titulo,
            descripcion,
            categoria,
            edificio,
            salon,
            recurso_id,
            tipo_problema
        } = req.body;

        if (
            !titulo?.trim() ||
            !descripcion?.trim() ||
            !categoria ||
            !edificio ||
            !salon ||
            !recurso_id ||
            !tipo_problema
        ) {
            eliminarArchivoSubido(archivoSubido);

            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios, incluido el recurso'
            });
        }

        const categoriasPermitidas = [
            'computo',
            'proyectores',
            'internet',
            'mobiliario',
            'electricidad',
            'otros'
        ];

        if (!categoriasPermitidas.includes(categoria)) {
            eliminarArchivoSubido(archivoSubido);

            return res.status(400).json({
                mensaje: 'Categoría no válida'
            });
        }

        const recursoId = Number(recurso_id);

        if (!Number.isInteger(recursoId) || recursoId <= 0) {
            eliminarArchivoSubido(archivoSubido);

            return res.status(400).json({
                mensaje: 'El recurso seleccionado no es válido'
            });
        }

        const [edificios] = await db.query(
            'SELECT id FROM edificios WHERE nombre = ?',
            [edificio]
        );

        if (edificios.length === 0) {
            eliminarArchivoSubido(archivoSubido);

            return res.status(404).json({
                mensaje: 'El edificio no existe'
            });
        }

        const problemasPorRecurso = {
            computadora: ['no_enciende', 'pantalla_danada', 'teclado_no_funciona', 'mouse_no_funciona', 'otro'],
            monitor: ['no_enciende', 'pantalla_danada', 'otro'],
            teclado: ['teclado_no_funciona', 'otro'],
            mouse: ['mouse_no_funciona', 'otro'],
            television: ['no_enciende', 'pantalla_danada', 'sin_senal', 'otro'],
            proyector: ['no_enciende', 'sin_senal', 'imagen_danada', 'otro'],
            aire_acondicionado: ['no_enciende', 'no_enfria', 'otro'],
            lampara: ['no_enciende', 'parpadea', 'otro'],
            mesa: ['danado', 'roto', 'inestable', 'otro'],
            silla: ['danado', 'roto', 'inestable', 'otro'],
            multicontacto: ['no_funciona', 'contacto_danado', 'otro'],
            contacto: ['no_funciona', 'contacto_danado', 'otro'],
            otro: ['otro']
        };

        const [salones] = await db.query(
            `SELECT id
             FROM salones
             WHERE nombre = ? AND edificio_id = ?`,
            [salon, edificios[0].id]
        );

        if (salones.length === 0) {
            eliminarArchivoSubido(archivoSubido);

            return res.status(404).json({
                mensaje: 'El salón no existe en ese edificio'
            });
        }

        const salonId = salones[0].id;

       const [recursos] = await db.query(
        `SELECT id, tipo
        FROM recursos
        WHERE id = ?
        AND salon_id = ?
        AND activo = 1`,
        [recursoId, salonId]
    );

        if (recursos.length === 0) {
            eliminarArchivoSubido(archivoSubido);

            return res.status(404).json({
                mensaje: 'El recurso no existe o no pertenece a ese salón'
            });
        }

        const problemasPermitidos = problemasPorRecurso[recursos[0].tipo] || ['otro'];

            if (!problemasPermitidos.includes(tipo_problema)) {
                eliminarArchivoSubido(archivoSubido);

                return res.status(400).json({
                    mensaje: 'El tipo de problema no corresponde al recurso seleccionado'
                });
    }

        const evidenciaNombre = archivoSubido
            ? archivoSubido.originalname
            : null;

        const evidenciaRuta = archivoSubido
            ? archivoSubido.filename
            : null;

        const evidenciaTipo = archivoSubido
            ? archivoSubido.mimetype.startsWith('image/')
                ? 'imagen'
                : 'video'
            : null;

        const [resultado] = await db.query(
            `INSERT INTO incidencias
            (
                titulo,
                descripcion,
                categoria,
                tipo_problema,
                usuario_id,
                salon_id,
                recurso_id,
                evidencia_nombre,
                evidencia_ruta,
                evidencia_tipo
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                titulo.trim(),
                descripcion.trim(),
                categoria,
                tipo_problema,
                req.usuario.id,
                salonId,
                recursoId,
                evidenciaNombre,
                evidenciaRuta,
                evidenciaTipo
            ]
        );

        return res.status(201).json({
            mensaje: 'Incidencia registrada correctamente',
            incidencia_id: resultado.insertId,
            recurso_id: recursoId,
            evidencia: evidenciaNombre
                ? {
                    nombre: evidenciaNombre,
                    tipo: evidenciaTipo
                }
                : null
        });

    } catch (error) {
        eliminarArchivoSubido(archivoSubido);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'Este recurso ya tiene una incidencia activa'
            });
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({
                mensaje: 'El salón o recurso indicado no existe'
            });
        }

        console.error('Error al crear incidencia:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al registrar la incidencia'
        });
    }
};

// Consultar las incidencias del alumno
const obtenerMisIncidencias = async (req, res) => {
    try {
        const [incidencias] = await db.query(
            `SELECT
                i.id,
                i.titulo,
                i.descripcion,
                i.categoria,
                i.estado,
                i.fecha_creacion,
                i.evidencia_nombre,
                i.evidencia_tipo,
                e.nombre AS edificio,
                s.nombre AS salon,
                r.id AS recurso_id,
                r.codigo AS recurso_codigo,
                r.nombre AS recurso_nombre
            FROM incidencias i
            INNER JOIN salones s ON i.salon_id = s.id
            INNER JOIN edificios e ON s.edificio_id = e.id
            LEFT JOIN recursos r ON i.recurso_id = r.id
            WHERE i.usuario_id = ?
            ORDER BY i.fecha_creacion DESC`,
            [req.usuario.id]
        );

        return res.json(incidencias);

    } catch (error) {
        console.error('Error al consultar incidencias:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al consultar las incidencias'
        });
    }
};

// Consultar el detalle de una incidencia
const obtenerIncidenciaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [incidencias] = await db.query(
            `SELECT
                i.id,
                i.titulo,
                i.descripcion,
                i.categoria,
                i.estado,
                i.fecha_creacion,
                i.evidencia_nombre,
                i.evidencia_tipo,
                i.evidencia_ruta,
                e.nombre AS edificio,
                s.nombre AS salon,
                r.id AS recurso_id,
                r.codigo AS recurso_codigo,
                r.nombre AS recurso_nombre
            FROM incidencias i
            INNER JOIN salones s ON i.salon_id = s.id
            INNER JOIN edificios e ON s.edificio_id = e.id
            LEFT JOIN recursos r ON i.recurso_id = r.id
            WHERE i.id = ? AND i.usuario_id = ?`,
            [id, req.usuario.id]
        );

        if (incidencias.length === 0) {
            return res.status(404).json({
                mensaje: 'La incidencia no existe o no tienes acceso'
            });
        }

        return res.json(incidencias[0]);

    } catch (error) {
        console.error('Error al consultar la incidencia:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al consultar la incidencia'
        });
    }
};

// Eliminar una incidencia propia que todavía esté recibida
const eliminarMiIncidencia = async (req, res) => {
    const { id } = req.params;
    const conexion = await db.getConnection();

    let evidenciaRuta = null;

    try {
        await conexion.beginTransaction();

        const [incidencias] = await conexion.query(
            `SELECT id, estado, evidencia_ruta
             FROM incidencias
             WHERE id = ? AND usuario_id = ?
             FOR UPDATE`,
            [id, req.usuario.id]
        );

        if (incidencias.length === 0) {
            await conexion.rollback();

            return res.status(404).json({
                mensaje: 'El reporte no existe o no tienes permiso para eliminarlo'
            });
        }

        const incidencia = incidencias[0];

        if (incidencia.estado !== 'recibida') {
            await conexion.rollback();

            return res.status(409).json({
                mensaje: 'Solo puedes eliminar reportes que estén en estado recibida'
            });
        }

        evidenciaRuta = incidencia.evidencia_ruta;

        // Eliminar primero el seguimiento relacionado
        await conexion.query(
            'DELETE FROM seguimiento WHERE incidencia_id = ?',
            [id]
        );

        // Eliminar la incidencia
        await conexion.query(
            'DELETE FROM incidencias WHERE id = ? AND usuario_id = ?',
            [id, req.usuario.id]
        );

        await conexion.commit();

        // Eliminar el archivo de evidencia después de confirmar la transacción
        if (evidenciaRuta) {
            const nombreSeguro = path.basename(evidenciaRuta);
            const rutaArchivo = path.join(
                __dirname,
                '../../uploads/evidencias',
                nombreSeguro
            );

            if (fs.existsSync(rutaArchivo)) {
                fs.unlink(rutaArchivo, (error) => {
                    if (error) {
                        console.error(
                            'No se pudo eliminar la evidencia:',
                            error.message
                        );
                    }
                });
            }
        }

        return res.json({
            mensaje: 'Reporte eliminado correctamente'
        });

    } catch (error) {
        await conexion.rollback();

        console.error('Error al eliminar reporte:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al eliminar el reporte'
        });

    } finally {
        conexion.release();
    }
};

// Consultar evidencia de una incidencia

const obtenerEvidencia = async (req, res) => {
    try {
        const { id } = req.params;

        let consulta = `
            SELECT
                i.evidencia_ruta,
                i.evidencia_tipo
            FROM incidencias i
            INNER JOIN salones s ON i.salon_id = s.id
            INNER JOIN edificios e ON s.edificio_id = e.id
            WHERE i.id = ?
        `;

        const parametros = [id];

        if (req.usuario.rol === 'alumno') {
            consulta += ' AND i.usuario_id = ?';
            parametros.push(req.usuario.id);

        } else if (req.usuario.rol === 'docente') {
            const ema = req.get('X-Docente-EMA');

            if (!ema) {
                return res.status(400).json({
                    mensaje: 'No has seleccionado un EMA'
                });
            }

            consulta += `
                AND (
                    e.nombre = ?
                    OR i.docente_id = ?
                )
            `;

            parametros.push(ema, req.usuario.id);

        } else if (req.usuario.rol !== 'administrador') {
            return res.status(403).json({
                mensaje: 'No tienes permiso para consultar esta evidencia'
            });
        }

        const [incidencias] = await db.query(
            consulta,
            parametros
        );

        if (
            incidencias.length === 0 ||
            !incidencias[0].evidencia_ruta
        ) {
            return res.status(404).json({
                mensaje: 'Evidencia no encontrada'
            });
        }

        const ruta = path.join(
            __dirname,
            '../../uploads/evidencias',
            incidencias[0].evidencia_ruta
        );

        if (!fs.existsSync(ruta)) {
            return res.status(404).json({
                mensaje: 'El archivo no está disponible'
            });
        }

        return res.sendFile(ruta);

    } catch (error) {
        console.error('Error al consultar evidencia:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al consultar la evidencia'
        });
    }
};

module.exports = {
    crearIncidencia,
    obtenerMisIncidencias,
    obtenerIncidenciaPorId,
    eliminarMiIncidencia,
    obtenerEvidencia
};
