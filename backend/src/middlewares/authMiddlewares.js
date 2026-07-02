const jwt = require('jsonwebtoken');

const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ message: "Acceso denegado: No se proporcionó un token" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_local');
            req.user = decoded; 

            // Control de Acceso Basado en Roles
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ 
                    message: `Acceso prohibido: Tu rol de '${req.user.role}' no tiene permisos.` 
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
    };
};

module.exports = authorizeRoles;