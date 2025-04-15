
const router = require('express').Router();

const userController = require('./user.controller');
const validate = require('../../middlewares/errorHandler');
const { registerSchema, updateSchema } = require('./user.validator');

// User routes
router.get('/', userController.getAllUsers);
router.post('/', validate(registerSchema), userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;