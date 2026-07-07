"use strict";

/**
 * Servicio de correo
 * Envia notificaciones por email usando nodemailer y un servidor SMTP
 * configurado por variables de entorno (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 */

const path = require('path');
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
// rutaEvidencia es la ruta absoluta de la foto en disco; si viene, se adjunta
// al correo y se muestra inline en el cuerpo (via cid).
const notificarClienteTareaPendienteValidacion = async ({ correoCliente, idTarea, descripcionTarea, rutaEvidencia }) => {
    const transporter = obtenerTransporter();
    // Si no se define un remitente explicito (SMTP_FROM), se usa la misma cuenta SMTP
    const remitente = process.env.SMTP_FROM || process.env.SMTP_USER;

    const conEvidencia = Boolean(rutaEvidencia);
    const htmlEvidencia = conEvidencia
        ? `<p>Evidencia del trabajo realizado:</p><img src="cid:evidencia-tarea" alt="Evidencia de la tarea" style="max-width:100%;border-radius:8px;" />`
        : `<p>Por favor revisa la evidencia cargada en la plataforma.</p>`;

    await transporter.sendMail({
        from: remitente,
        to: correoCliente,
        subject: `Orden #${idTarea} finalizada - Pendiente de Validación`,
        text: `Hola, la tarea "${descripcionTarea}" fue finalizada por el trabajador y ahora está en estado "Pendiente de Validación".`,
        html: `<p>Hola,</p><p>La tarea <strong>"${descripcionTarea}"</strong> fue finalizada por el trabajador.</p><p>Estado actual: <strong>Pendiente de Validación</strong>.</p>${htmlEvidencia}`,
        attachments: conEvidencia
            ? [
                  {
                      filename: path.basename(rutaEvidencia),
                      path: rutaEvidencia,
                      cid: 'evidencia-tarea', // referenciado por el <img src="cid:..."> del html
                  },
              ]
            : [],
    });
};

// Alerta activa de stock critico: avisa al responsable de inventario cuando un
// insumo cae al limite de seguridad. Se llama desde insumosService.registrarMovimientoInsumo.
// El destinatario se configura con SMTP_ALERT_TO; si no esta definido se usa la cuenta SMTP.
const notificarStockCritico = async (insumo) => {
    const transporter = obtenerTransporter();
    const remitente = process.env.SMTP_FROM || process.env.SMTP_USER;
    const destinatario = process.env.SMTP_ALERT_TO || process.env.SMTP_USER;

    await transporter.sendMail({
        from: remitente,
        to: destinatario,
        subject: `⚠️ Stock crítico: ${insumo.nombre_insumo}`,
        text: `El insumo "${insumo.nombre_insumo}" alcanzó el nivel crítico. Stock actual: ${insumo.stock} (límite de seguridad: ${insumo.limite_seguridad}). Se requiere reposición.`,
        html: `<p>El insumo <strong>"${insumo.nombre_insumo}"</strong> alcanzó el nivel crítico.</p><p>Stock actual: <strong>${insumo.stock}</strong> (límite de seguridad: ${insumo.limite_seguridad}).</p><p>Se requiere reposición.</p>`,
    });
};

module.exports = {
    notificarClienteTareaPendienteValidacion,
    notificarStockCritico,
};