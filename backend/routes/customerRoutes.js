const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
// const { authenticate } = require('../middlewares/authMiddleware'); // Assuming this exists

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.post('/', customerController.createCustomer);

module.exports = router;
