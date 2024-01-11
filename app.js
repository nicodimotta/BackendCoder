const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose'); // Importar mongoose
const ProductManager = require('./productManager');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');

const app = express();
const server = http.createServer(app); // Crear el servidor HTTP utilizando express
const io = socketIO(server); // Inicializar socket.io con el servidor HTTP
const port = 8080;

// Configuración de mongoose
mongoose.connect('mongodb+srv://nicodimotta14:<password>@coder.pned8p5.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB.');
});

const productManager = new ProductManager('./data/productos.json');

// Configuración de handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Rutas para productos
app.use('/api/products', productRouter);

// Rutas para carritos
app.use('/api/carts', cartRouter);

// Configuración de Socket.IO
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Escuchar eventos de agregar y eliminar productos desde el cliente
  socket.on('addProduct', (newProduct) => {
    // Lógica para agregar el producto al productManager
    productManager.addProduct(newProduct);
    // Emitir un evento a todos los clientes para actualizar la lista de productos
    io.emit('productAdded', newProduct);
  });

  socket.on('deleteProduct', (productId) => {
    // Lógica para eliminar el producto del productManager
    productManager.deleteProduct(productId);
    // Emitir un evento a todos los clientes para actualizar la lista de productos
    io.emit('productDeleted', productId);
  });
});

// Rutas para las vistas con Handlebars
app.get('/', (req, res) => {
  // Lógica para obtener todos los productos
  const products = productManager.getProducts();
  // Renderizar la vista home.handlebars
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  // Lógica para obtener todos los productos
  const products = productManager.getProducts();
  // Renderizar la vista realTimeProducts.handlebars
  res.render('realTimeProducts', { products });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});






