const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

module.exports = {
  async getAllProducts() {
    try {
      const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
      return JSON.parse(productsData);
    } catch (error) {
      console.error('Error al obtener todos los productos:', error.message);
      return [];
    }
  },

  async getProductById(productId) {
    try {
      const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
      const products = JSON.parse(productsData);
      return products.find(product => product.id === productId);
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error.message);
      return null;
    }
  },

  async addProduct(newProduct) {
    try {
      const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
      const products = JSON.parse(productsData);

      products.push(newProduct);

      await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
      console.log(`Producto agregado con ID ${newProduct.id}.`);
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
    }
  },

  async updateProduct(updatedProduct) {
    try {
      const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
      let products = JSON.parse(productsData);

      const index = products.findIndex(product => product.id === updatedProduct.id);
      if (index !== -1) {
        products[index] = updatedProduct;

        await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        console.log(`Producto actualizado con ID ${updatedProduct.id}.`);
      } else {
        console.log(`Producto con ID ${updatedProduct.id} no encontrado. No se pudo actualizar.`);
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
    }
  },

  async deleteProduct(productId) {
    try {
      const productsData = await fs.promises.readFile(productsFilePath, 'utf-8');
      let products = JSON.parse(productsData);

      products = products.filter(product => product.id !== productId);

      await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
      console.log(`Producto eliminado con ID ${productId}.`);
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }
  },

  // Implementa métodos adicionales según sea necesario
};






  
  
  
  