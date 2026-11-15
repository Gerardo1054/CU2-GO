const { rateLimit } = require('express-rate-limit');

const limiteLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        mensaje: 'Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.'
    }
});

const limiteRegistro = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        mensaje: 'Se alcanzó el límite de registros. Intenta nuevamente en una hora.'
    }
});

module.exports = {
    limiteLogin,
    limiteRegistro
};
