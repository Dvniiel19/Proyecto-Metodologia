"use strict";

const nodemailer = require('nodemailer');

const obtenerTransporter = () => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error('Falta configurar SMTP_HOST, SMTP_USER o SMTP_PASS para enviar correos.');
    }

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });
};

const notificarClienteTareaPendienteValidacion = async ({ correoCliente, idTarea, descripcionTarea }) => {
    const transporter = obtenerTransporter();
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
