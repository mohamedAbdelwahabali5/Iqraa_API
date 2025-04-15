
const Joi = require('joi');

const bookSchema = Joi.object({
    title: Joi.string().min(3).max(100).trim().required(),
    author: Joi.string().min(3).max(50).trim().required(),
    description: Joi.string().min(10).max(2000).trim().required(),
    pdfFile: Joi.string().trim().uri().required(),
    available: Joi.boolean().default(true).required(),
    price: Joi.number().min(0).required(),
    stockQuantity: Joi.number().integer().min(0).required(),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    publishedDate: Joi.date().max('now').required(),
    language: Joi.string().valid('English', 'Arabic')
});
      
module.exports = {
    bookSchema
};