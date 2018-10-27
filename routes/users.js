const express = require('express');
const usersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();


// Order Routes
router.get('/', usersController.getAllUsers);
router.get('/:username', usersController.getSingleUser);
router.post('/', checkAuth, usersController.addSingleUser);
router.patch('/:username', checkAuth, usersController.updateUser);
router.delete('/:username', checkAuth, usersController.deleteUser);

module.exports = router;
// Note: All the funtions are written in contollers folder