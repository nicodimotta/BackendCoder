const mongoose = require('mongoose');

// Definir el esquema del mensaje
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: String, required: true },
});

// Crear el modelo de mensaje
const Message = mongoose.model('Message', messageSchema);

class MessageManager {
  async addMessage(newMessage) {
    try {
      // Crear una nueva instancia del modelo de mensaje
      const messageToAdd = new Message(newMessage);

      // Guardar el nuevo mensaje en la base de datos
      await messageToAdd.save();
      console.log(`Mensaje agregado con ID ${messageToAdd._id}.`);
    } catch (error) {
      console.error('Error al agregar mensaje:', error.message);
    }
  }

  async getMessages(limit) {
    try {
      // Obtener todos los mensajes desde la base de datos
      let messages;
      if (limit) {
        messages = await Message.find().limit(limit);
      } else {
        messages = await Message.find();
      }
      
      return messages;
    } catch (error) {
      console.error('Error al obtener mensajes:', error.message);
      return [];
    }
  }
}

// Exportar la clase para usarla en otros archivos
module.exports = MessageManager;

