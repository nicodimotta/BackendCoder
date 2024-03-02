const bcrypt = require('bcrypt');
const User = require('../dao/models/User');

// Servicio para crear un nuevo usuario
async function createUser(userData) {
  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Crear el usuario en la base de datos
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
}

// Otros métodos de servicio relacionados con la gestión de usuarios...

module.exports = {
  createUser,
  // Exporta otros métodos de servicio según sea necesario
};
