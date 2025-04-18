const router = require('express').Router();
const {getCart,addToCart,updateCartItem,removeFromCart,clearCart} = require('./cart.controller');
const validate = require('../../middlewares/errorHandler');
const { addToCartSchema, updateCartSchema } = require('./cart.validator');
const authMiddleware = require('../../middlewares/authMiddleware');

// All cart routes require authentication
// router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', validate(addToCartSchema), addToCart);
router.patch('/update', validate(updateCartSchema), updateCartItem);
router.delete('/item/:bookId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;