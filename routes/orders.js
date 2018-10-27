const express = require('express');
const orderController = require('../controllers/orders')
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// Order Routes
router.get('/', checkAuth, orderController.getAllOrders);
router.get('/:id', checkAuth, orderController.getSingleOrder);
router.post('/', checkAuth, orderController.addSingleOrder);
router.patch('/:id', checkAuth, orderController.updateOrder);
router.delete('/:id', checkAuth, orderController.deleteOrder);

module.exports = router;
// Note: All the funtions are written in contollers folder