const Joi = require('joi');

const categorySchema = Joi.object({
    name: Joi.string().required().min(2).max(50).trim(),
    description: Joi.string().optional().max(500).trim(),
    isActive: Joi.boolean().default(true)
});

module.exports = {
    categorySchema
};