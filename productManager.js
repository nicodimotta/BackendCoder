class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
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
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(productId) {
      const foundProduct = this.products.find(product => product.id === productId);
  
      if (foundProduct) {
        return foundProduct;
      } else {
        console.log(`Producto con ID ${productId} no encontrado. Not found.`);
        return null;
      }
    }
  }
  
  
  const productManager = new ProductManager();

  const mouseGaming1 = {
    title: 'Razer Viper v2 pro',
    description: 'Mouse Gaming Razer Viper v2 pro',
    price: 120,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'RVV2P',
    stock: 20,
  };
  
  const mouseGaming2 = {
    title: 'Logitech Superlight',
    description: 'Mouse Gaming Logitech Superlight',
    price: 150,
    thumbnail: 'ruta/imagen2.jpg',
    code: 'LSL',
    stock: 15,
  };
  
  productManager.addProduct(mouseGaming1);
  productManager.addProduct(mouseGaming2);
  
  console.log(productManager.getProducts());
  
  const productIdToFind = 1;
  const foundProduct = productManager.getProductById(productIdToFind);
  console.log(foundProduct);
  
  
  
  