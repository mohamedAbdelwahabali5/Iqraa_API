const Joi = require('joi');


const ratingSchema = Joi.object({
    value: Joi.number().min(1).max(5).required(),
    book: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    // i will take the user id from the token in the authmiddleware
});

module.exports = ratingSchema;