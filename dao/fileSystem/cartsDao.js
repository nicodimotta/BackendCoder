const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

module.exports = {
  async getAllCarts() {
    try {
      const cartsData = await fs.promises.readFile(cartsFilePath, 'utf-8');
      return JSON.parse(cartsData);
    } catch (error) {
      console.error('Error al obtener todos los carritos:', error.message);
      return [];
    }
  },

  async getCartById(cartId) {
    try {
      const cartsData = await fs.promises.readFile(cartsFilePath, 'utf-8');
      const carts = JSON.parse(cartsData);
      return carts.find(cart => cart.id === cartId);
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error.message);
      return null;
    }
  },

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cartsData = await fs.promises.readFile(cartsFilePath, 'utf-8');
      const carts = JSON.parse(cartsData);

      const cartIndex = carts.findIndex(cart => cart.id === cartId);
      if (cartIndex !== -1) {
        // verificar si el producto ya está en el carrito
        const existingProductIndex = carts[cartIndex].products.findIndex(p => p.id === productId);

        if (existingProductIndex !== -1) {
          // incrementar la cantidad si el producto ya está en el carrito
          carts[cartIndex].products[existingProductIndex].quantity += quantity;
        } else {
          // agregar el producto al carrito con la cantidad especificada
          carts[cartIndex].products.push({ id: productId, quantity });
        }

        // escribir los cambios de vuelta al archivo
        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        console.log(`Producto con ID ${productId} agregado al carrito con ID ${cartId}.`);
      } else {
        console.log(`Carrito con ID ${cartId} no encontrado. No se pudo agregar el producto.`);
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error.message);
    }
  },

  // implementa el resto de métodos para actualizar y eliminar carritos si es necesario
};


