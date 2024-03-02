const Product = require('../dao/models/Product');

const productService = {
  getProducts: async ({ limit = 10, page = 1, sort, query, category, availability }) => {
    try {
      // Construir el objeto de búsqueda según los parámetros recibidos
      const searchQuery = {};
      if (category) searchQuery.category = category;
      if (availability) searchQuery.availability = availability;
      if (query) {
        // Agregar lógica de búsqueda avanzada según tus necesidades
        // Puedes utilizar expresiones regulares, índices de texto completo, etc.
        // Por ejemplo: searchQuery.$text = { $search: query };
      }

      // Realizar la búsqueda y ordenamiento de productos
      let products = await Product.find(searchQuery);

      // Ordenamiento de productos
      if (sort) {
        const sortOrder = sort === 'desc' ? -1 : 1;
        products = products.sort((a, b) => sortOrder * (a.price - b.price));
      }

      // Paginación de productos
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const currentProducts = products.slice(startIndex, endIndex);

      // Calcular información de paginación
      const totalProducts = products.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      // Construir el objeto de respuesta
      const response = {
        status: 'success',
        payload: currentProducts,
        totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}` : null,
        nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}` : null,
      };

      return response;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  getProductById: async (productId) => {
    try {
      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw new Error('Failed to fetch product by ID');
    }
  },

  addProduct: async (productData) => {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error('Failed to add product');
    }
  },

  updateProduct: async (productId, updatedProductData) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });
      if (!updatedProduct) throw new Error('Product not found');
      return updatedProduct;
    } catch (error) {
      throw new Error('Failed to update product');
    }
  },

  deleteProduct: async (productId) => {
    try {
      const deletedProduct = await Product.findByIdAndRemove(productId);
      if (!deletedProduct) throw new Error('Product not found');
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  },
};

module.exports = productService;
