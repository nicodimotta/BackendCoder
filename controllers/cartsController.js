const Cart = require('../dao/models/Cart');
const Product = require('../dao/models/Product');

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
      const cart = await Cart.findById(req.params.cid).populate('products.productId');

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      // Renderiza la vista 'cart' y pasa el carrito como contexto
      res.render('cart', { cart });
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

      const product = await Product.findById(pid);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Verificar si ya existe el producto en el carrito
      const existingProduct = cart.products.find((p) => p.productId.equals(pid));

      if (existingProduct) {
        // Si existe, actualizar la cantidad
        existingProduct.quantity += quantity || 1;
      } else {
        // Si no existe, agregar el nuevo producto al carrito
        cart.products.push({ productId: pid, quantity: quantity || 1 });
      }

      // Guardar el carrito actualizado
      await cart.save();

      res.json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteProductFromCart: async (req, res) => {
    try {
      const { cid, pid } = req.params;

      const cart = await Cart.findById(cid);

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      // Filtrar los productos para excluir el que se quiere eliminar
      cart.products = cart.products.filter((p) => !p.productId.equals(pid));

      // Guardar el carrito actualizado
      await cart.save();

      res.json({ message: 'Product removed from cart successfully', cart });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateProductQuantity: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      // Actualizar la cantidad de ejemplares del producto en el carrito
      const productIndex = cart.products.findIndex((product) => product.productId.equals(pid));
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.json({ message: 'Product quantity updated successfully', cart });
      } else {
        res.status(404).json({ error: 'Product not found in cart' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteAllProductsFromCart: async (req, res) => {
    try {
      const { cid } = req.params;

      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      // Eliminar todos los productos del carrito
      cart.products = [];
      await cart.save();

      res.json({ message: 'All products removed from cart successfully', cart });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = cartsController;




