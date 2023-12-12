const express = require('express');
const ProductManager = require('./productManager'); 
const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');

const app = express();
const port = 8080;

const productManager = new ProductManager('./data/productos.json');

app.use(express.json());

// Rutas para productos
app.use('/api/products', productRouter);

// Rutas para carritos
app.use('/api/carts', cartRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});



