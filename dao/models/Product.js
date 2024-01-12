const mongoose = require('mongoose');

// Definir el esquema para el modelo Product
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

// Crear el modelo Product utilizando el esquema definido
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo para su uso en otros archivos
module.exports = Product;
