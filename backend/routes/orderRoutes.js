const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyRole, optionalToken } = require('../middlewares/authMiddleware');

router.post('/', optionalToken, orderController.createOrder);
router.get('/', verifyToken, orderController.getOrders);
router.put('/:id/status', verifyToken, verifyRole(['ADMIN', 'MANAGER', 'KITCHEN', 'WAITER']), orderController.updateOrderStatus);
router.post('/:id/pay', verifyToken, orderController.createPayment);

module.exports = router;
