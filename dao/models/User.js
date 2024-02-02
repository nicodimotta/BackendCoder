const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'usuario', // x defecto todos los usuarios tendrán el rol 'usuario'
  },
});

// metodo para hashear la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      user.password = await bcrypt.hash(user.password, 10); // 10 es el costo del hash
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;

