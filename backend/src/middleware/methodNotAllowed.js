const rutas = [
    { path: '/api/auth/registro', methods: ['POST'] },
    { path: '/api/auth/login', methods: ['POST'] },
    { path: '/api/auth/logout', methods: ['POST'] },
    { path: '/api/auth/perfil', methods: ['GET'] },

    { path: '/api/incidencias', methods: ['POST'] },
    { path: '/api/incidencias/:id/evidencia', methods: ['GET'] },
    { path: '/api/incidencias/mis-incidencias', methods: ['GET'] },
    { path: '/api/incidencias/:id', methods: ['GET', 'DELETE'] },

    { path: '/api/admin/incidencias', methods: ['GET'] },
    { path: '/api/admin/incidencias/:id/estado', methods: ['PUT'] },
    { path: '/api/admin/incidencias/:id/seguimiento', methods: ['GET'] },
    { path: '/api/admin/incidencias/:id', methods: ['DELETE'] },

    { path: '/api/recursos/espacios', methods: ['GET'] },
    { path: '/api/recursos', methods: ['GET', 'POST'] },

    { path: '/api/docente/incidencias/disponibles', methods: ['GET'] },
    { path: '/api/docente/incidencias/asignadas', methods: ['GET'] },
    { path: '/api/docente/incidencias/:id/tomar', methods: ['POST'] },
    { path: '/api/docente/incidencias/:id/estado', methods: ['PUT'] },
    { path: '/api/docente/incidencias/:id/seguimiento', methods: ['GET'] },

    { path: '/', methods: ['GET'] },
    { path: '/api/status', methods: ['GET'] }
];

function prepararRuta(ruta) {
    const segmentos = ruta.path.split('/').filter(Boolean);

    const expresion = segmentos.map(segmento => {
        if (segmento.startsWith(':')) {
            return '[^/]+';
        }

        return segmento.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('/');

    return {
        ...ruta,
        expresion: new RegExp(`^/${expresion}/?$`),
        especificidad: segmentos.filter(
            segmento => !segmento.startsWith(':')
        ).length
    };
}

const rutasPreparadas = rutas.map(prepararRuta);

function methodNotAllowed(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }

    const coincidencias = rutasPreparadas.filter(ruta =>
        ruta.expresion.test(req.path)
    );

    if (coincidencias.length === 0) {
        return next();
    }

    const mayorEspecificidad = Math.max(
        ...coincidencias.map(ruta => ruta.especificidad)
    );

    const rutaCoincidente = coincidencias.find(
        ruta => ruta.especificidad === mayorEspecificidad
    );

    const permitidos = [...rutaCoincidente.methods];

    if (permitidos.includes('GET')) {
        permitidos.push('HEAD');
    }

    if (permitidos.includes(req.method)) {
        return next();
    }

    res.set('Allow', permitidos.join(', '));

    return res.status(405).json({
        mensaje: 'Método HTTP no permitido para esta ruta.',
        metodos_permitidos: permitidos
    });
}

module.exports = methodNotAllowed;
