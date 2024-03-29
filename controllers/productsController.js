const productService = require('../services/productService');

const productsController = {
  getProducts: async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query, category, availability } = req.query;

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
      let products = await productService.getProducts(searchQuery);

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

      res.render('products', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.pid);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addProduct: async (req, res) => {
    try {
      const newProduct = await productService.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const updatedProduct = req.body;

      const product = await productService.updateProduct(pid, updatedProduct);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const result = await productService.deleteProduct(pid);

      if (!result.success) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = productsController;




