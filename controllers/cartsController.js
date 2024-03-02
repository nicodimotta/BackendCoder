const cartService = require('../services/cartService');

const cartsController = {
  createCart: async (req, res) => {
    try {
      const newCart = await cartService.createCart(req.body);
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getCartById: async (req, res) => {
    try {
      const cart = await cartService.getCartById(req.params.cid);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.render('cart', { cart });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addProductToCart: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await cartService.addProductToCart(cid, pid, quantity);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteProductFromCart: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const result = await cartService.deleteProductFromCart(cid, pid);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateProductQuantity: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await cartService.updateProductQuantity(cid, pid, quantity);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteAllProductsFromCart: async (req, res) => {
    try {
      const { cid } = req.params;
      const result = await cartService.deleteAllProductsFromCart(cid);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateCart: async (req, res) => {
    try {
      const { cid } = req.params;
      const updatedCart = req.body;
      const result = await cartService.updateCart(cid, updatedCart);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = cartsController;





