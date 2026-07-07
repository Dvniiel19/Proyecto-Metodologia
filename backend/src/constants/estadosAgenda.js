"use strict";

/**
 * Estados del ciclo de vida de un servicio (Agenda).
 * Flujo normal: Pendiente -> Personal Asignado -> En Proceso -> Pendiente de Evaluacion -> Finalizado
 *
 * - Pendiente:                servicio agendado, sin trabajador asignado
 * - Personal Asignado:        un coordinador asigno trabajador(es) al servicio (asignarServicioService)
 * - En Proceso:               un trabajador ficho entrada en el servicio
 * - Pendiente de Evaluacion:  el trabajo fue marcado como terminado; el cliente ya puede evaluar
 * - Finalizado:               el cliente evaluo el servicio (fin del ciclo)
 * - Cancelado:                el servicio no se realizara
 */
const ESTADOS_AGENDA = {
    PENDIENTE: 'Pendiente',
    PERSONAL_ASIGNADO: 'Personal Asignado',
    EN_PROCESO: 'En Proceso',
    PENDIENTE_EVALUACION: 'Pendiente de Evaluacion',
    FINALIZADO: 'Finalizado',
    CANCELADO: 'Cancelado',
};

module.exports = {
    ESTADOS_AGENDA,
};
