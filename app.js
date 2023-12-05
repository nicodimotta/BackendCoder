const express = require('express');
const ProductManager = require('./productManager'); // Asegúrate de ajustar la ruta según tu estructura de archivos

const app = express();
const port = 3000; // Puedes cambiar el puerto según tus preferencias

// instancia de ProductManager con la ruta del archivo
const productManager = new ProductManager('./data/productos.json');

// endpoint para obtener productos
app.get('/products', (req, res) => {
  // obtener el parametro de límite de la consulta (?limit=)
  const limit = req.query.limit;

  // obtener produc desde ProductManager
  const products = productManager.getProducts();

  // aplicar limite si se proporciona
  const limitedProducts = limit ? products.slice(0, parseInt(limit)) : products;

  // enviar los productos como respuesta
  res.json({ products: limitedProducts });
});

// iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
