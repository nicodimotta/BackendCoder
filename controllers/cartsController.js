const Cart = require('../models/Cart'); // Asegúrate de importar el modelo de Carrito

const cartsController = {
  createCart: async (req, res) => {
    try {
      const newCart = new Cart(req.body);
      await newCart.save();

      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getCartById: async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.cid);

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addProductToCart: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findById(cid);

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      // Aquí puedes realizar la lógica para agregar un producto al carrito usando Mongoose

      res.json({ message: 'Product added to cart successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = cartsController;


