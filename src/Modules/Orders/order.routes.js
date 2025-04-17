const router = require('express').Router();
const orderController = require('./order.controller');
const validate = require('../../middlewares/errorHandler');
const { orderSchema, updateOrderSchema } = require('./order.validator');
const authMiddleware = require('../../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/', validate(orderSchema), orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', validate(updateOrderSchema), orderController.updateOrderStatus);
router.patch('/:id/cancel', orderController.cancelOrder); 

module.exports = router;