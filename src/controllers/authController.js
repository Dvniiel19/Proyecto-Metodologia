const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Si tienes un DataSource de TypeORM configurado en src/config/db, impórtalo.
// Por ejemplo: const { AppDataSource } = require('../config/db');
const db = require('../config/db'); 

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar al usuario en tu tabla personalizada usando SQL o tu repositorio de TypeORM
        // Nota: Asegúrate de que los nombres de las columnas coincidan ('correo', 'contrasena')
        const queryRunner = db.createQueryRunner ? db : db.dataSource; // Adapta según cómo exportes tu db
        
        const usuarios = await db.query(
            'SELECT * FROM usuarios WHERE correo = $1 LIMIT 1', 
            [email]
        );
        
        const user = usuarios[0];

        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas (Usuario no encontrado)" });
        }

       // 2. CONFIDENCIALIDAD: Comparar la contraseña
        console.log("=== 🔍 INICIO DIAGNÓSTICO DE LOGIN ===");
        console.log("Texto plano que mandaste en Thunder Client:", password);
        console.log("Objeto de usuario recuperado de la DB:", user);
        console.log("Hash exacto que llegó desde Supabase:", user ? user.contrasena : "¡No hay contraseña!");
        
        const isMatch = await bcrypt.compare(password, user.contrasena);
        console.log("¿La comparación matemática dio True?:", isMatch);
        console.log("======================================");

        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas (Contraseña inválida)" });
        }

        // 3. RBAC: Mapear el 'id_rol' a los nombres de tus roles (Supervisor, Encargado, Operario)
        // Según tu tabla, id_rol es un número (1, 2, 3...). Definamos el mapeo:
        const rolesMapeo = {
            1: 'Supervisor',
            2: 'Encargado de Inventario',
            3: 'Operario'
        };
        const userRole = rolesMapeo[user.id_rol] || 'Operario';

        // 4. INTEGRIDAD: Generar tu propio JWT firmado con tu SECRET local
        const payload = {
            id: user.id_usuario,
            email: user.correo,
            role: userRole
        };

        const token = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET || 'secreto_local', { expiresIn: '8h' });

        return res.json({
            message: "Autenticación exitosa",
            token: token,
            user: {
                id: user.id_usuario,
                email: user.correo,
                role: userRole
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

module.exports = { login };