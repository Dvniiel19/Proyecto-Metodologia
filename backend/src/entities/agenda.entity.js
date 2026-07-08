"use strict"; 
// Importa la clase EntitySchema de TypeORM para definir la estructura de la base de datos
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({

    name: 'Agenda', 

    tableName: 'agenda',
    
    // Definición de todas las columnas (campos) que tendrá la tabla
    columns: {
        id_servicio: {
            primary: true,   // Indica que es la llave primaria (Primary Key) de la tabla
            type: 'int',     // Define el tipo de dato numérico entero
            generated: true, // Hace que sea Autoincremental (TypeORM crea un 'serial' en Postgres)
        },
        fecha_programada: {
            type: 'date',    // Guarda solo fechas (año-mes-día)
            nullable: false, // Obligatorio: No permite que se guarde un registro sin fecha (NOT NULL)
        },
        hora_inicio: {
            type: 'time',    // Guarda solo la hora exacta
            nullable: true,  // Opcional: Permite valores nulos en la base de datos
        },
        hora_fin: {
            type: 'time',
            nullable: true,
        },
        // Ciclo de vida del servicio (ver constants/estadosAgenda.js):
        // Pendiente -> En Proceso -> Pendiente de Evaluacion -> Finalizado
        // Se mantiene varchar (no enum de Postgres) para que synchronize no
        // tenga que alterar el tipo de la columna; los valores validos se
        // controlan en la capa de servicios/validaciones.
        estado: {
            type: 'varchar',     
            length: 50,           
            nullable: false,      // Obligatorio
            default: 'Pendiente', // si al insertar no envías este campo, tomara este valor automáticamente
        },
        // Observacion del trabajador/supervisor al marcar el trabajo terminado
        observacion_final: {
            type: 'text',  
            nullable: true, // Opcional
        },
        id_contrato: {
            type: 'int',    // Debe coincidir con el tipo de dato del ID en la tabla de Contratos
            nullable: true, // Opcional (por si un servicio es independiente y no tiene contrato asociado)
        },
    },
    
    // definición de las relaciones (llaves foráneas / foreign keys) con otras tablas
    relations: {
        contrato: {
            target: 'Contrato', // Nombre de la entidad con la que se relaciona
            type: 'many-to-one', // relación "muchos a uno" (muchos servicios pueden pertenecer a un solo contrato)
            joinColumn: { name: 'id_contrato'}, // Le dice a TypeORM qué columna local guarda esta relación
            inverseSide: 'agenda', // nombre de la propiedad en el esquema 'Contrato' que apunta de vuelta hacia acá
        },
        asignar_servicio: {
            target: 'AsignarServicio',
            type: 'one-to-many', // Relación "uno a muchos" (Un servicio puede tener varias asignaciones)
            inverseSide: 'agenda',
        },
        asistencia: {
            target: 'Asistencia',
            type: 'one-to-many', // Un servicio puede registrar múltiples entradas de asistencia
            inverseSide: 'agenda',
        },
        checklist: {
            target: 'Checklist',
            type: 'one-to-many', // Un servicio puede tener múltiples tareas en su checklist
            inverseSide: 'agenda',
        },
        consumo_insumo: {
            target: 'ConsumoInsumo',
            type: 'one-to-many', // un servicio puede tener múltiples registros de insumos consumidos
            inverseSide: 'agenda',
        },
        evaluacion_final: {
            target: 'EvaluacionFinal',
            type: 'one-to-one', // relación "Uno a Uno" (un servicio tiene exactamente Una evaluación final, ni más ni menos)
            inverseSide: 'agenda',
        },
    },
});