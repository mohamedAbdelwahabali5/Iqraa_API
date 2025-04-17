const ratingController = require('./rating.controller');
const validate = require('../../middlewares/errorHandler');
const authMiddleware = require('../../middlewares/authMiddleware');
const ratingSchema  = require('./rating.validator');
const express = require('express');
const router = express.Router();


// Rating routes 
router.post('/', authMiddleware, validate(ratingSchema), ratingController.createOrUpdateRating);
router.get('/:bookId', ratingController.getRatingsByBook);
router.delete('/:id', authMiddleware, ratingController.deleteRating);

module.exports = router;