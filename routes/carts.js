const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/cartsController');

router.post('/', cartsController.createCart);
router.get('/:cid', cartsController.getCartById);
router.post('/:cid/product/:pid', cartsController.addProductToCart);
router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart);
router.put('/:cid', cartsController.updateCart);
router.put('/:cid/products/:pid', cartsController.updateProductQuantity);
router.delete('/:cid', cartsController.deleteAllProductsFromCart);

// Agrega una nueva ruta para la vista del carrito
router.get('/:cid/view', cartsController.viewCart);

module.exports = router;




