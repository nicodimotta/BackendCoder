const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session'); // Importa express-session
const bcrypt = require('bcrypt');
const Product = require('./dao/models/Product');
const Cart = require('./dao/models/Cart');
const User = require('./dao/models/User');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/carts');
const passportConfig = require('./passport-config');

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
app.engine('hbs', exphbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// Configuración de Passport
passportConfig(passport);

// Configuración de express-session
app.use(session({
  secret: 'your-secret-key', // Cambia esto con una clave secreta fuerte
  resave: true,
  saveUninitialized: true,
}));

// Inicialización de Passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// Rutas para productos
app.use('/products', productsRouter);

// Rutas para carritos
app.use('/api/carts', cartRouter);

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
    res.render('home', { products, user: req.user });
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('realTimeProducts', { products, user: req.user });
  } catch (error) {
    console.error('Error al obtener productos en tiempo real:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Rutas para autenticación (login, registro, logout)
app.use('/auth', require('./routes/auth')(passport));

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});










