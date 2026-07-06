/**
 * Utilidades de encriptacion de contraseñas con bcrypt
 * Las contraseñas nunca se guardan en texto plano: se guarda solo el hash,
 * que no se puede revertir para obtener la contraseña original
 */

const bcrypt = require('bcryptjs');

// Genera el hash de la contraseña. El 10 son las "rondas de sal": cuantas veces
// se repite el algoritmo. Mas rondas = mas lento de calcular = mas dificil de
// romper por fuerza bruta (10 es el estandar recomendado)
const encrypt = async (textPlain) => {
    const hash = await bcrypt.hash(textPlain,10)
    return hash
}

// Compara una contraseña en texto plano contra un hash guardado.
// bcrypt vuelve a hashear la contraseña ingresada con la misma sal y compara
// los resultados: nunca se "desencripta" el hash guardado
const compare = async (passwordPlain, hashPassword) => {
    return await bcrypt.compare(passwordPlain, hashPassword)
}

module.exports = {
    encrypt,
    compare
}