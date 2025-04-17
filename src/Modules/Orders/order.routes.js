const router = require('express').Router();
const {createOrder,getOrders,getOrderById,updateOrderStatus,cancelOrder} = require('./order.controller');
const validate = require('../../middlewares/errorHandler');
const { orderSchema, updateOrderSchema } = require('./order.validator');
const authMiddleware = require('../../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/', validate(orderSchema), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', validate(updateOrderSchema),updateOrderStatus);
router.patch('/:id/cancel', cancelOrder); 

module.exports = router;