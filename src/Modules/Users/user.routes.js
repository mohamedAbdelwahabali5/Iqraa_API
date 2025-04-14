
const router = require('express').Router();

const userController = require('./user.controller');
const userValidator = require('./user.validator');

// User routes
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;