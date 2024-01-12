const mongoose = require('mongoose');

// Definir el esquema del mensaje
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: String, required: true },
});

// Crear el modelo de mensaje
const Message = mongoose.model('Message', messageSchema);

// Exportar el modelo para usarlo en otros archivos
module.exports = Message;
