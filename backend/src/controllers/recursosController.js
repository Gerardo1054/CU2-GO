
const db = require('../database');

// Obtener edificios y salones
const obtenerCatalogoEspacios = async (_req, res) => {
    try {
        const [espacios] = await db.query(
            `SELECT
                e.id,
                e.nombre AS edificio,
                s.id AS salon_id,
                s.nombre AS salon,
                s.tipo_espacio,
                CAST(LEFT(s.nombre, 1) AS UNSIGNED) AS piso
             FROM edificios e
             INNER JOIN salones s ON s.edificio_id = e.id
             ORDER BY e.nombre, s.nombre`
        );

        return res.json(espacios);

    } catch (error) {
        console.error('Error al consultar espacios:', error.message);

        return res.status(500).json({
            mensaje: 'Error al consultar los espacios'
        });
    }
};

// Obtener recursos de un salón y sus incidencias activas
const obtenerRecursosPorSalon = async (req, res) => {
    try {
        const { salon_id, edificio, salon, categoria } = req.query;

        let salonId = salon_id ? Number(salon_id) : null;

        if (!salonId && edificio && salon) {
            const [salones] = await db.query(
                `SELECT s.id
                 FROM salones s
                 INNER JOIN edificios e ON e.id = s.edificio_id
                 WHERE e.nombre = ? AND s.nombre = ?`,
                [edificio, salon]
            );

            if (!salones.length) {
                return res.status(404).json({
                    mensaje: 'No se encontró ese salón'
                });
            }

            salonId = salones[0].id;
        }

        if (!Number.isInteger(salonId) || salonId <= 0) {
            return res.status(400).json({
                mensaje: 'Indica salon_id o la combinación edificio y salon'
            });
        }

        const categoriasPermitidas = [
            'computo',
            'electricidad',
            'climatizacion',
            'iluminacion',
            'audiovisual',
            'mobiliario',
            'otros'
        ];

        if (categoria && !categoriasPermitidas.includes(categoria)) {
            return res.status(400).json({
                mensaje: 'Categoría no válida'
            });
        }

        const parametros = [salonId];
        let filtroCategoria = '';

        if (categoria) {
            filtroCategoria = ' AND r.categoria = ?';
            parametros.push(categoria);
        }

        const [recursos] = await db.query(
            `SELECT
                r.id,
                r.salon_id,
                r.codigo,
                r.nombre,
                r.tipo,
                r.categoria,
                r.posicion_x,
                r.posicion_y,
                r.activo
             FROM recursos r
             WHERE r.salon_id = ?
                AND r.activo = 1
                ${filtroCategoria}
             ORDER BY r.categoria, r.codigo`,
            parametros
        );

        if (!recursos.length) {
            return res.json([]);
        }

        const idsRecursos = recursos.map(recurso => recurso.id);

        const [incidencias] = await db.query(
            `SELECT
                id,
                recurso_id,
                titulo,
                descripcion,
                tipo_problema,
                estado,
                fecha_creacion
             FROM incidencias
             WHERE recurso_id IN (?)
               AND estado IN (
                   'recibida',
                   'en_proceso',
                   'pendiente_validacion'
               )
             ORDER BY fecha_creacion DESC`,
            [idsRecursos]
        );

        const incidenciasPorRecurso = {};

        incidencias.forEach(incidencia => {
            const id = incidencia.recurso_id;

            if (!incidenciasPorRecurso[id]) {
                incidenciasPorRecurso[id] = [];
            }

            incidenciasPorRecurso[id].push(incidencia);
        });

        const resultado = recursos.map(recurso => {
            const incidenciasActivas =
                incidenciasPorRecurso[recurso.id] || [];

            return {
                ...recurso,
                incidencias_activas: incidenciasActivas,
                disponible: incidenciasActivas.length === 0 ? 1 : 0,
                incidencia_activa_id:
                    incidenciasActivas[0]?.id || null
            };
        });

        return res.json(resultado);

    } catch (error) {
        console.error('Error al consultar recursos:', error.message);

        return res.status(500).json({
            mensaje: 'Error al consultar los recursos'
        });
    }
};

// Crear un recurso
const crearRecurso = async (req, res) => {
    try {
        const {
            salon_id,
            codigo,
            nombre,
            tipo,
            categoria,
            posicion_x,
            posicion_y
        } = req.body;

        if (
            !salon_id ||
            !codigo?.trim() ||
            !nombre?.trim() ||
            !tipo ||
            !categoria ||
            posicion_x === undefined ||
            posicion_y === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const categoriasPermitidas = [
            'computo',
            'electricidad',
            'climatizacion',
            'iluminacion',
            'audiovisual',
            'mobiliario',
            'otros'
        ];

        const x = Number(posicion_x);
        const y = Number(posicion_y);

        if (
            !categoriasPermitidas.includes(categoria) ||
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            x < 0 ||
            x > 100 ||
            y < 0 ||
            y > 100
        ) {
            return res.status(400).json({
                mensaje: 'Datos del recurso no válidos'
            });
        }

        const salonId = Number(salon_id);

        if (!Number.isInteger(salonId) || salonId <= 0) {
            return res.status(400).json({
                mensaje: 'El salón indicado no es válido'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO recursos
                (
                    salon_id,
                    codigo,
                    nombre,
                    tipo,
                    categoria,
                    posicion_x,
                    posicion_y
                )
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                salonId,
                codigo.trim(),
                nombre.trim(),
                tipo,
                categoria,
                x,
                y
            ]
        );

        return res.status(201).json({
            mensaje: 'Recurso registrado correctamente',
            recurso_id: resultado.insertId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'Ya existe ese código en el salón'
            });
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({
                mensaje: 'El salón indicado no existe'
            });
        }

        console.error('Error al crear recurso:', error.message);

        return res.status(500).json({
            mensaje: 'Error al registrar el recurso'
        });
    }
};

module.exports = {
    obtenerCatalogoEspacios,
    obtenerRecursosPorSalon,
    crearRecurso
};
