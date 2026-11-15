const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/evidencias/');
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const nombre = `${crypto.randomUUID()}${extension}`;

        cb(null, nombre);
    }
});

const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm'
];

const filtroArchivos = (req, file, cb) => {
    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato no permitido. Utiliza JPG, PNG, WEBP, MP4 o WEBM.'));
    }
};

const uploadEvidencia = multer({
    storage: almacenamiento,
    fileFilter: filtroArchivos,
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 1
    }
});

module.exports = uploadEvidencia;
