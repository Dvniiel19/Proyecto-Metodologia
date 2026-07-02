"use strict";

/**
 * Servicio de correo
 * Envia notificaciones por email usando nodemailer y un servidor SMTP
 * configurado por variables de entorno (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 */

const nodemailer = require('nodemailer');

// Crea el "transporter" (la conexion con el servidor SMTP) leyendo la config del .env.
// Se valida que existan las credenciales antes de intentar conectar, para dar un
// error claro de configuracion en vez de un error confuso de conexion.
const obtenerTransporter = () => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587); // 587 es el puerto SMTP estandar con STARTTLS
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error('Falta configurar SMTP_HOST, SMTP_USER o SMTP_PASS para enviar correos.');
    }

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        // El puerto 465 usa TLS desde el inicio (secure); en otros puertos (587)
        // la conexion parte en claro y se cifra despues con STARTTLS
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });
};

// Notifica al cliente que su tarea fue finalizada por el trabajador y quedo
// esperando su validacion. Se llama desde tareaService.finalizarTareaConEvidencia.
const notificarClienteTareaPendienteValidacion = async ({ correoCliente, idTarea, descripcionTarea }) => {
    const transporter = obtenerTransporter();
    // Si no se define un remitente explicito (SMTP_FROM), se usa la misma cuenta SMTP
    const remitente = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from: remitente,
        to: correoCliente,
        subject: `Orden #${idTarea} finalizada - Pendiente de Validación`,
        text: `Hola, la tarea "${descripcionTarea}" fue finalizada por el trabajador y ahora está en estado "Pendiente de Validación".`,
        html: `<p>Hola,</p><p>La tarea <strong>"${descripcionTarea}"</strong> fue finalizada por el trabajador.</p><p>Estado actual: <strong>Pendiente de Validación</strong>.</p><p>Por favor revisa la evidencia cargada.</p>`,
    });
};

module.exports = {
    notificarClienteTareaPendienteValidacion,
};
