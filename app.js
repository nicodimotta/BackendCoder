const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const { Product, Cart, Message } = require('./dao/mongo/mongoController');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 8080;

// Configuración de mongoose
mongoose.connect('mongodb+srv://nicodimotta14:<codernico2024>@coder.pned8p5.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB.');
});

// Configuración de handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Rutas para productos
app.use('/api/products', productRouter(Product));

// Rutas para carritos
app.use('/api/carts', cartRouter(Cart));

// Configuración de Socket.IO
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Escuchar eventos de agregar y eliminar productos desde el cliente
  socket.on('addProduct', async (newProduct) => {
    try {
      const product = new Product(newProduct);
      await product.save();

      // Emitir un evento a todos los clientes para actualizar la lista de productos
      io.emit('productAdded', newProduct);
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await Product.deleteOne({ _id: productId });

      // Emitir un evento a todos los clientes para actualizar la lista de productos
      io.emit('productDeleted', productId);
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
    }
  });
});

// Rutas para las vistas con Handlebars
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al obtener productos en tiempo real:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});







