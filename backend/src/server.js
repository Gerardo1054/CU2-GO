const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const incidenciasRoutes = require('./routes/incidenciasRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recursosRoutes = require('./routes/recursosRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
const methodNotAllowed = require('./middleware/methodNotAllowed');

const db = require('./database');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Docente-EMA'
    ]
}));
app.use(express.json());
app.use(cookieParser());
app.use(methodNotAllowed);
app.use('/api/auth', authRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recursos', recursosRoutes);
app.use('/api/docente', docenteRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a CU2 GO',
        estado: 'Servidor funcionando correctamente'
    });
});

app.get('/api/status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 AS conexion');

        res.json({
            proyecto: 'CU2 GO',
            api: 'Activa',
            base_de_datos: rows[0].conexion === 1
                ? 'Conectada'
                : 'Desconectada'
        });
    } catch (error) {
        console.error('Error de conexión:', error.message);

        res.status(500).json({
            proyecto: 'CU2 GO',
            api: 'Activa',
            base_de_datos: 'Error de conexión'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
