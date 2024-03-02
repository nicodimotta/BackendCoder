const mongoose = require('mongoose');

// Definir el esquema para User
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' }
});

// Definir el modelo User
const User = mongoose.model('User', userSchema);

// Definir el esquema para Product
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

// Definir el modelo Product
const Product = mongoose.model('Product', productSchema);

// Definir el esquema para Cart
const cartSchema = new mongoose.Schema({
  // Agrega los campos necesarios para el carrito
});

// Definir el modelo Cart
const Cart = mongoose.model('Cart', cartSchema);

// Definir el esquema para Message
const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

// Definir el modelo Message
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Product, Cart, Message };

