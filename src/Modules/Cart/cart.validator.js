const Joi = require('joi');

const addToCartSchema = Joi.object({
    bookId: Joi.string().required().hex().length(24),
    quantity: Joi.number().required().min(1).integer()
});

const updateCartSchema = Joi.object({
    bookId: Joi.string().required().hex().length(24),
    quantity: Joi.number().required().min(0).integer()
});

module.exports = {
    addToCartSchema,
    updateCartSchema
};