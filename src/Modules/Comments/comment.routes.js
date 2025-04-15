const commentController = require('./comment.controller');
const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/errorHandler');
const authMiddleware = require('../../middlewares/authMiddleware');
const { commentSchema } = require('./comment.validator');


// Comment routes
router.post('/', authMiddleware, validate(commentSchema.create), commentController.createComment);
router.get('/:bookId', commentController.getAllComments); // comments for spasific book
router.get('/:id', commentController.getCommentById);
router.put('/:id', validate(commentSchema.update), commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;

