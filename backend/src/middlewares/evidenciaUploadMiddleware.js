"use strict";

/**
 * Middleware de subida de evidencias (multer)
 * Recibe la foto que sube el trabajador al finalizar una tarea,
 * valida que sea una imagen real y la guarda en uploads/evidencias
 */

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const DIRECTORIO_EVIDENCIAS = path.join(__dirname, '../../uploads/evidencias');
const MIME_TYPES_VALIDOS = ['image/jpeg', 'image/jpg', 'image/png'];
const EXTENSIONES_VALIDAS = ['.jpg', '.jpeg', '.png'];

// Configuracion de almacenamiento en disco: donde y con que nombre se guarda el archivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Crea la carpeta si no existe (recursive evita error si ya esta creada)
        fs.mkdirSync(DIRECTORIO_EVIDENCIAS, { recursive: true });
        cb(null, DIRECTORIO_EVIDENCIAS);
    },
    filename: (req, file, cb) => {
        // Nombre unico: timestamp + numero aleatorio. Asi dos fotos subidas al mismo
        // tiempo nunca chocan, y no usamos el nombre original (que podria ser peligroso)
        const extension = path.extname(file.originalname).toLowerCase();
        const nombreUnico = `tarea-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, nombreUnico);
    },
});

// Filtro de seguridad: valida la extension Y el mime type del archivo.
// Se revisan ambos porque cualquiera de los dos se puede falsificar por separado
// (ej: renombrar un .exe a .jpg cambia la extension pero no el mime type que envia el navegador)
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
        fileSize: 5 * 1024 * 1024, // maximo 5MB por foto
    },
});

// Envoltorio del middleware de multer: captura sus errores (archivo muy grande,
// formato invalido) y los responde como 400 con el formato estandar de la API,
// en vez de dejar que Express los convierta en un 500 generico
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
