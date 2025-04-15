const Joi = require('joi');

const commentSchema = {
  create: Joi.object({
    text: Joi.string()
      .trim()
      .min(3)
      .max(300)
      .required()
      .messages({
        'string.empty': 'Comment text cannot be empty',
        'string.min': 'Comment must be at least 3 characters',
        'string.max': 'Comment cannot exceed 300 characters',
        'any.required': 'Comment text is required'
      }),
    book: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid book ID format',
        'any.required': 'Book reference is required'
      })
  }),

  update: Joi.object({
    text: Joi.string()
      .trim()
      .min(3)
      .max(300)
      .required()
      .messages({
        'string.empty': 'Comment text cannot be empty',
        'string.min': 'Comment must be at least 3 characters',
        'string.max': 'Comment cannot exceed 300 characters',
        'any.required': 'Comment text is required'
      })
  })
};

module.exports = { commentSchema };