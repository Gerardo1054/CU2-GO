const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

if (
    typeof nombre !== 'string' ||
    typeof correo !== 'string' ||
    typeof password !== 'string' ||
    !nombre.trim() ||
    !correo.trim() ||
    !password
) {
    return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios y deben ser válidos'
    });
}

if (nombre.trim().length < 3 || nombre.trim().length > 100) {
    return res.status(400).json({
        mensaje: 'El nombre debe tener entre 3 y 100 caracteres'
    });
}

const correoNormalizado = correo.trim().toLowerCase();

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!formatoCorreo.test(correoNormalizado)) {
    return res.status(400).json({
        mensaje: 'El formato del correo no es válido'
    });
}

if (password.length < 8 || password.length > 72) {
    return res.status(400).json({
        mensaje: 'La contraseña debe tener entre 8 y 72 caracteres'
    });
}

        const [usuarios] = await db.query(
            'SELECT id FROM usuarios WHERE correo = ?',
            [correoNormalizado]
        );

        if (usuarios.length > 0) {
            return res.status(409).json({
                mensaje: 'Este correo ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO usuarios (nombre, correo, password, rol)
             VALUES (?, ?, ?, ?)`,
            [nombre.trim(), correoNormalizado, passwordHash, 'alumno']
        );

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente'
        });

    } catch (error) {
    console.error('Error al registrar usuario:', error.message);

    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            mensaje: 'Este correo ya está registrado. Intenta iniciar sesión.'
        });
    }

    return res.status(500).json({
        mensaje: 'Error interno al registrar el usuario'
    });
}
};

const iniciarSesion = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                mensaje: 'Correo y contraseña son obligatorios'
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const [usuarios] = await db.query(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correoNormalizado]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const usuario = usuarios[0];

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 2 * 60 * 60 * 1000
        });

        return res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);

        return res.status(500).json({
            mensaje: 'Error interno al iniciar sesión'
        });
    }
};

// Cerrar sesión
const cerrarSesion = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res.json({
        mensaje: 'Sesión cerrada correctamente'
    });
};

module.exports = {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion
};
