const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.products = [];
    this.productIdCounter = 1;
    this.path = path;
    // cargar productos desde el archivo al inicializar la instancia
    this.loadProducts();
  }

  addProduct(newProduct) {
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.thumbnail ||
      !newProduct.code ||
      !newProduct.stock
    ) {
      console.log('Todos los campos son obligatorios. No se pudo agregar el producto.');
      return;
    }

    const isCodeDuplicate = this.products.some(product => product.code === newProduct.code);
    if (isCodeDuplicate) {
      console.log(`Ya existe un producto con el código ${newProduct.code}. No se pudo agregar el producto.`);
      return;
    }

    const productToAdd = {
      id: this.productIdCounter++,
      ...newProduct,
    };

    this.products.push(productToAdd);
    console.log(`Producto "${productToAdd.title}" agregado con ID ${productToAdd.id}.`);

    // guardar el nuevo producto en el archivo
    this.saveProducts();
  }

  getProducts() {
    // leer el archivo y devolver todos los productos
    this.loadProducts();
    return this.products;
  }

  getProductById(productId) {
    // leer el archivo y buscar el prod por ID
    this.loadProducts();
    const foundProduct = this.products.find(product => product.id === productId);

    if (foundProduct) {
      return foundProduct;
    } else {
      console.log(`Producto con ID ${productId} no encontrado. Not found.`);
      return null;
    }
  }

  updateProduct(productId, updatedProduct) {
    // leer el archivo, buscar el producto por ID y actualizarlo
    this.loadProducts();
    const indexToUpdate = this.products.findIndex(product => product.id === productId);

    if (indexToUpdate !== -1) {
      // mantener el ID y actualizar el resto de las prop
      this.products[indexToUpdate] = {
        id: productId,
        ...updatedProduct,
      };

      // guardar los productos actualizados en el archivo
      this.saveProducts();

      console.log(`Producto con ID ${productId} actualizado.`);
    } else {
      console.log(`Producto con ID ${productId} no encontrado. No se pudo actualizar.`);
    }
  }

  deleteProduct(productId) {
    // leer el archivo, buscar el producto por ID y eliminarlo
    this.loadProducts();
    const indexToDelete = this.products.findIndex(product => product.id === productId);

    if (indexToDelete !== -1) {
      // eliminar el producto del array
      this.products.splice(indexToDelete, 1);

      // guardar los productos actualizados en el archivo
      this.saveProducts();

      console.log(`Producto con ID ${productId} eliminado.`);
    } else {
      console.log(`Producto con ID ${productId} no encontrado. No se pudo eliminar.`);
    }
  }

  // func para cargar productos desde el archivo al inicializar
  loadProducts() {
    try {
      const fileContent = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(fileContent);
    } catch (error) {
      // manejar el error, por ej si el archivo no existe
      console.error('Error al cargar productos:', error.message);
    }
  }

  // func para guardar productos en el archivo
  saveProducts() {
    try {
      const dataToWrite = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, dataToWrite, 'utf8');
    } catch (error) {
      // manejar el error, por ej si no se puede escribir en el archivo
      console.error('Error al guardar productos:', error.message);
    }
  }
}

module.exports = ProductManager; // Exportar la clase para usarla en otros archivos

// instancia de ProductManager con la ruta del archivo
const productManager = new ProductManager('./data/productos.json');

// ... (código para agregar productos, imprimir lista, buscar por ID, etc.)



  
  
  
  