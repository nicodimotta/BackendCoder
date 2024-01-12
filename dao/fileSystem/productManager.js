const Product = require('../models/Product'); // Importar el modelo de Producto

class ProductManager {
  constructor(io) {
    this.io = io; // Se agrega el objeto io para emitir eventos de WebSocket
  }

  async addProduct(newProduct) {
    try {
      const productToAdd = new Product(newProduct);

      // Guardar el nuevo producto en la base de datos
      await productToAdd.save();

      console.log(`Producto "${productToAdd.title}" agregado con ID ${productToAdd.id}.`);

      // Emitir evento de WebSocket al agregar un producto
      this.io.emit('productAdded', productToAdd);

      return productToAdd;
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      // Eliminar el producto de la base de datos por su ID
      const deletedProduct = await Product.findByIdAndRemove(productId);

      if (deletedProduct) {
        // Emitir evento de WebSocket al eliminar un producto
        this.io.emit('productDeleted', deletedProduct);

        console.log(`Producto con ID ${productId} eliminado.`);
      } else {
        console.log(`Producto con ID ${productId} no encontrado. No se pudo eliminar.`);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      throw error;
    }
  }

  async getProducts(limit) {
    try {
      // Obtener todos los productos de la base de datos
      let products = await Product.find();

      if (limit) {
        products = products.slice(0, limit);
      }

      return products;
    } catch (error) {
      console.error('Error al obtener productos:', error.message);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      // Obtener un producto por su ID de la base de datos
      const foundProduct = await Product.findById(productId);

      if (foundProduct) {
        return foundProduct;
      } else {
        console.log(`Producto con ID ${productId} no encontrado. Not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener producto por ID:', error.message);
      throw error;
    }
  }

  async updateProduct(productId, updatedProduct) {
    try {
      // Actualizar un producto por su ID en la base de datos
      const updatedProductDocument = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });

      if (updatedProductDocument) {
        console.log(`Producto con ID ${productId} actualizado.`);
        return updatedProductDocument;
      } else {
        console.log(`Producto con ID ${productId} no encontrado. No se pudo actualizar.`);
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error.message);
      throw error;
    }
  }
}

// Exportar la clase para usarla en otros archivos
module.exports = ProductManager;





  
  
  
  