const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const passport = require('passport'); // Agregamos la importación de Passport
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt'); // Agregamos la importación de bcrypt
const Product = require('./dao/models/Product');
const Cart = require('./dao/models/Cart');
const User = require('./dao/models/User'); // Agregamos la importación del modelo de usuario
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/carts');
const passportConfig = require('./passport-config'); // Agregamos la importación de la configuración de Passport

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 8080;

// config de mongoose
mongoose.connect('mongodb+srv://nicodimotta14:<codernico2024>@coder.pned8p5.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB.');
});

// config de handlebars
app.engine('hbs', exphbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// config de Passport
passportConfig(passport); // config de Passport

// middleware para manejar sesiones
app.use(session({
  secret: 'your-secret-key', // cambiar esto con una clave secreta fuerte
  resave: true,
  saveUninitialized: true,
}));

// inicializacion de passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// rutas para productos
app.use('/products', productsRouter);

// rutas para carritos
app.use('/api/carts', cartRouter);

// config de Socket.IO
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // escuchar eventos de agregar y eliminar productos desde el cliente
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

      // emitir un evento a todos los clientes para actualizar la lista de productos
      io.emit('productDeleted', productId);
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
    }
  });
});

// rutas para las vistas con Handlebars
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products, user: req.user }); // Pasamos el usuario a la vista
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('realTimeProducts', { products, user: req.user }); // Pasamos el usuario a la vista
  } catch (error) {
    console.error('Error al obtener productos en tiempo real:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// rutas para autenticación (login, registro, logout)
app.use('/auth', require('./routes/auth')(passport)); // Asumiendo que tienes un archivo auth.js en tu carpeta de rutas

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});









