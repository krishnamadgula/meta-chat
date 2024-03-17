const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');


router.post('/', userController.createUser);
router.get('/', authMiddleware,userController.getAllUsers);
router.put('/:username', authMiddleware,userController.updateUser);
router.delete('/:username', authMiddleware,userController.deleteUser);

module.exports = router;