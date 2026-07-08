<div align="center">

# 🧹 Sistema de Servicios de Aseo

**Plataforma integral para la gestión de trabajadores, asignación de servicios y seguimiento de órdenes de trabajo en tiempo real.**

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

*Proyecto desarrollado para el ramo METODOLOGIA DE DESARROLLO — Universidad del Bío-Bío.*

</div>

---

## 📋 Descripción del Proyecto

Las empresas de servicios de aseo enfrentan un desafío operativo constante: coordinar equipos de trabajadores en terreno, asignar servicios de forma eficiente, verificar que el trabajo se ejecutó correctamente y un sistema de asistencia. La gestión manual de estas operaciones —planillas, llamadas telefónicas y registros en papel— genera pérdida de trazabilidad, retrasos en la comunicación y falta de evidencia verificable del trabajo realizado.

**El sistema** resuelve este problema centralizando todo el ciclo operativo en una única plataforma web. El flujo principal parte con la **asignación de servicios**: un administrador crea una orden de trabajo, define las tareas asociadas y la asigna a uno o más trabajadores según su disponibilidad. Desde ese momento, la orden avanza por un **ciclo de estados controlado** (pendiente → en progreso → completada), donde cada transición queda registrada y notificada a los involucrados.

Los trabajadores documentan su avance directamente desde la plataforma, incluyendo la **subida de evidencia fotográfica** por tarea y el **registro de consumo de insumos**, lo que permite a los supervisores validar la calidad del servicio sin necesidad de presencia física. El sistema complementa este flujo con notificaciones automáticas por correo electrónico y alertas programadas, garantizando que ninguna orden quede sin seguimiento.

---

## ✨ Características Principales

- 👷 **Gestión de Trabajadores** — Registro, edición y administración de usuarios con control de roles y autenticación segura mediante JWT.
- 📌 **Asignación de Servicios** — Creación de órdenes de trabajo y asignación de tareas a trabajadores según disponibilidad.
- 🔄 **Ciclo de Estados de Órdenes** — Transición controlada de estados (pendiente, en progreso, completada) con trazabilidad completa.
- 📸 **Evidencia Fotográfica** — Subida de imágenes por tarea mediante Multer para validar la ejecución del trabajo en terreno.
- 🧴 **Control de Insumos** — Registro de consumo de insumos asociado a cada tarea ejecutada.
- 📧 **Notificaciones por Correo** — Alertas automáticas vía Nodemailer ante asignaciones y cambios de estado relevantes.
- ⏰ **Tareas Programadas** — Procesos automáticos recurrentes (recordatorios y alertas) gestionados con node-cron.
- ✅ **Validación de Datos** — Doble capa de validación en el backend con Joi y express-validator.

---

## 🏗️ Arquitectura y Tecnologías

El sistema sigue una arquitectura cliente-servidor desacoplada, comunicada mediante una API REST.

| Capa | Tecnología | Descripción |
|:---|:---|:---|
| **Frontend** | React 19 + Vite | SPA con enrutamiento vía React Router y estilos con Tailwind CSS 4 |
| **Backend** | Node.js + Express | API REST con autenticación JWT, validaciones y manejo de archivos |
| **ORM** | TypeORM | Mapeo objeto-relacional con sincronización automática de entidades |
| **Base de Datos** | PostgreSQL (Supabase) | Base de datos relacional gestionada en la nube |
| **Servicios** | Nodemailer / Multer / node-cron | Correos transaccionales, carga de evidencias y tareas programadas |

```
Proyecto-Metodologia/
├── backend/          # API REST (Express + TypeORM)
│   └── src/
│       ├── auth/         # Autenticación y JWT
│       ├── controllers/  # Lógica de negocio
│       ├── entities/     # Entidades TypeORM (esquema de BD)
│       ├── middlewares/  # Autorización, manejo de archivos
│       ├── routes/       # Definición de endpoints
│       ├── services/     # Servicios (correo, cron)
│       └── validations/  # Esquemas de validación
└── frontend/         # SPA (React + Vite + Tailwind)
    └── src/
        ├── components/   # Componentes reutilizables de UI
        ├── pages/        # Vistas principales de la aplicación
        ├── context/      # Estado global (React Context)
        ├── hooks/        # Hooks personalizados
        ├── services/     # Comunicación con la API REST
        ├── helpers/      # Funciones de apoyo
        ├── utils/        # Utilidades generales
        ├── styles/       # Estilos (Tailwind CSS)
        └── assets/       # Recursos estáticos
```

---

## 🚀 Guía de Instalación Local

### Requisitos Previos

- **Node.js** ≥ 18.x y **npm**
- Instancia de **PostgreSQL** (local o [Supabase](https://supabase.com))

### 1. Clonar el repositorio

```bash
git clone https://github.com/Dvniiel19/Proyecto-Metodologia.git
cd Proyecto-Metodologia
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
```

### 4. Configurar variables de entorno

Crea un archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:

```env

# Base de Datos (PostgreSQL / Supabase)
DATABASE_URL=postgresql://usuario:contraseña@host:5432nombre_bd

# Autenticación
JWT_SECRET=tu_clave_secreta_segura
JWT_EXPIRY=1d

# Correo (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
SMTP_FROM=tu_correo@gmail.com
SMTP_ALERT_TO=correo_supervisor@gmail.com
```
---
JWT_SECRET: Cambia el secreto por defecto por una cadena larga, aleatoria y compleja. Puedes generar una usando:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
---

## 🗄️ Configuración de Base de Datos

El esquema relacional se gestiona **exclusivamente a través de las entidades TypeORM** (`backend/src/entities/`) con sincronización automática habilitada (`synchronize: true`). **No se requieren migraciones ni scripts SQL manuales**: al iniciar el servidor, TypeORM crea y actualiza las tablas automáticamente a partir de las entidades definidas.


## ▶️ Uso y Ejecución

Levanta ambos servidores en terminales separadas:

**Backend** (disponible en `http://localhost:3000`):

```bash
cd backend
npm run dev
```

**Frontend** (disponible en `http://localhost:5173`):

```bash
cd frontend
npm run dev
```

---

## 👤 Autores

**Daniel Parra, Claudio Vera, Martina Concha, Ignacio Jara, Tomas Morales**
Estudiantes de Ingeniería de Ejecución en Computación e Informática
Universidad del Bío-Bío

[![GitHub](https://img.shields.io/badge/GitHub-Netuu410-181717?style=for-the-badge&logo=github)](https://github.com/Netuu410)
[![GitHub](https://img.shields.io/badge/GitHub-Dvniiel19-181717?style=for-the-badge&logo=github)](https://github.com/Dvniiel19)
[![GitHub](https://img.shields.io/badge/GitHub-tomasmorales1-181717?style=for-the-badge&logo=github)](https://github.com/tomasmorales1)
[![GitHub](https://img.shields.io/badge/GitHub-martylaprocoder777-181717?style=for-the-badge&logo=github)](https://github.com/martylaprocoder777)
[![GitHub](https://img.shields.io/badge/GitHub-ignacioj4r4-181717?style=for-the-badge&logo=github)](https://github.com/ignacioj4r4)



---

<div align="center">

*Desarrollado con dedicación para la asignatura Metodologia de Desarrollo la Universidad del Bío-Bío — 2026* 🎓

</div>
