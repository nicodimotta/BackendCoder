const Cart = require('../models/Cart'); // Importa el modelo de Mongoose

class CartManager {
  async createCart(newCart) {
    try {
      // Crea un nuevo documento de carrito usando Mongoose
      const createdCart = await Cart.create(newCart);
      console.log(`Carrito creado con ID ${createdCart._id}.`);
    } catch (error) {
      console.error('Error al crear carrito:', error.message);
    }
  }

  async getCartById(cartId) {
    try {
      // Encuentra un carrito por ID usando Mongoose
      const foundCart = await Cart.findById(cartId);
      if (foundCart) {
        return foundCart;
      } else {
        console.log(`Carrito con ID ${cartId} no encontrado. Not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener carrito por ID:', error.message);
    }
  }

  async addProductToCart(cartId, productId, quantity, productManager) {
    try {
      // Buscar el carrito por ID usando Mongoose
      const foundCart = await Cart.findById(cartId);

      if (foundCart) {
        // Buscar el producto por ID usando el productManager (si aún lo necesitas)
        const product = await productManager.getProductById(productId);

        if (product) {
          // Verificar si el producto ya está en el carrito
          const existingProduct = foundCart.products.find(p => p.id === productId);

          if (existingProduct) {
            // Incrementar la cantidad si el producto ya está en el carrito
            existingProduct.quantity += quantity;
          } else {
            // Agregar el producto al carrito con la cantidad especificada
            foundCart.products.push({ id: productId, quantity });
          }

          // Guardar el carrito actualizado usando Mongoose
          await foundCart.save();
          console.log(`Producto con ID ${productId} agregado al carrito con ID ${cartId}.`);
        } else {
          console.log(`Producto con ID ${productId} no encontrado. No se pudo agregar al carrito.`);
        }
      } else {
        console.log(`Carrito con ID ${cartId} no encontrado. No se pudo agregar el producto.`);
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error.message);
    }
  }
}

module.exports = CartManager;

