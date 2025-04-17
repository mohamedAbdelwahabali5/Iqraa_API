const Joi = require('joi');

const orderItemSchema = Joi.object({
    book: Joi.string().required().hex().length(24),
    quantity: Joi.number().required().min(1).integer(),
    price: Joi.number().required().min(0)
});

const orderSchema = Joi.object({
    shippingAddress: Joi.object({
        name: Joi.string().required().min(3).max(50),
        address: Joi.string().required().min(10).max(200),
        phone: Joi.string().required().pattern(/^[0-9]{10,15}$/)
    }).required(),
    paymentMethod: Joi.string().valid('Credit Card', 'Cash on Delivery'),
    orderItems: Joi.array().items(orderItemSchema).min(1).required(),
    discount: Joi.number().min(0)
});

const updateOrderSchema = Joi.object({
    status: Joi.string().valid(
        "In-Progress", 
        "Confirmed", 
        "Processing", 
        "Shipping", 
        "Out for Delivery", 
        "Delivered", 
        "Cancelled"
    ).required()
});

const cancelOrderSchema = Joi.object({
    reason: Joi.string().max(200)
});

module.exports = {
    orderSchema,
    updateOrderSchema,
    cancelOrderSchema
};