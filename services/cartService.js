const Cart = require('../dao/models/Cart');
const Product = require('../dao/models/Product');

const cartService = {
  createCart: async (cartData) => {
    try {
      const newCart = new Cart(cartData);
      return await newCart.save();
    } catch (error) {
      throw new Error('Failed to create cart');
    }
  },

  getCartById: async (cartId) => {
    try {
      return await Cart.findById(cartId).populate('products.productId');
    } catch (error) {
      throw new Error('Failed to get cart by ID');
    }
  },

  addProductToCart: async (cartId, productId, quantity) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Cart not found');

      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');

      const existingProduct = cart.products.find((p) => p.productId.equals(productId));
      if (existingProduct) {
        existingProduct.quantity += quantity || 1;
      } else {
        cart.products.push({ productId, quantity: quantity || 1 });
      }

      return await cart.save();
    } catch (error) {
      throw new Error('Failed to add product to cart');
    }
  },

  deleteProductFromCart: async (cartId, productId) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Cart not found');

      cart.products = cart.products.filter((p) => !p.productId.equals(productId));
      return await cart.save();
    } catch (error) {
      throw new Error('Failed to delete product from cart');
    }
  },

  updateProductQuantity: async (cartId, productId, quantity) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Cart not found');

      const productIndex = cart.products.findIndex((p) => p.productId.equals(productId));
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
        return await cart.save();
      } else {
        throw new Error('Product not found in cart');
      }
    } catch (error) {
      throw new Error('Failed to update product quantity');
    }
  },

  deleteAllProductsFromCart: async (cartId) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Cart not found');

      cart.products = [];
      return await cart.save();
    } catch (error) {
      throw new Error('Failed to delete all products from cart');
    }
  },
};

module.exports = cartService;
