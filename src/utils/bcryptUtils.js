const bcrypt = require('bcryptjs');

// encriptamos
const encrypt = async (textPlain) => {
    const hash = await bcrypt.hash(textPlain,10)
    return hash
}

// comparamos
const compare = async (passwordPlain, hashPassword) => {
    return await bcrypt.compare(passwordPlain, hashPassword)
}

module.exports = {
    encrypt,
    compare
}