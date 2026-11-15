const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                mensaje: 'No has iniciado sesión'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = {
            id: decoded.id,
            rol: decoded.rol
        };

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: 'Sesión inválida o expirada'
        });
    }
};

const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
};

module.exports = {
    verificarToken,
    verificarRol
};
