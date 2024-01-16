const Product = require('../dao/models/Product');


const productsController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.pid);

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
      const newProduct = new Product(req.body);
      await newProduct.save();

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const updatedProduct = req.body;

      const product = await Product.findByIdAndUpdate(pid, updatedProduct, { new: true });

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
      const product = await Product.findByIdAndRemove(pid);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = productsController;


