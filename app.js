const express = require('express');
const ProductManager = require('./productManager'); 

const app = express();
const port = 3000;

const productManager = new ProductManager('./data/productos.json');

app.use(express.json());

// Endpoint para obtener todos los productos con o sin límite
app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts(parseInt(limit));
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).send(`Producto con ID ${productId} no encontrado`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

