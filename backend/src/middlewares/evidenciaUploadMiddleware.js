"use strict";

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const DIRECTORIO_EVIDENCIAS = path.join(__dirname, '../../uploads/evidencias');
const MIME_TYPES_VALIDOS = ['image/jpeg', 'image/jpg', 'image/png'];
const EXTENSIONES_VALIDAS = ['.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(DIRECTORIO_EVIDENCIAS, { recursive: true });
        cb(null, DIRECTORIO_EVIDENCIAS);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const nombreUnico = `tarea-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, nombreUnico);
    },
});

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    const extensionValida = EXTENSIONES_VALIDAS.includes(extension);
    const mimeValido = MIME_TYPES_VALIDOS.includes(mime);

    if (!extensionValida || !mimeValido) {
        return cb(new Error('Solo se permiten imágenes en formato .jpg, .jpeg o .png'));
    }

    return cb(null, true);
};

const uploadEvidencia = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const subirFotoEvidencia = (req, res, next) => {
    uploadEvidencia.single('foto_evidencia')(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                errors: null,
            });
        }
        return next();
    });
};

module.exports = {
    subirFotoEvidencia,
};
