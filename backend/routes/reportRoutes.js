const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, verifyRole(['ADMIN', 'MANAGER']), reportController.getDashboardReport);

module.exports = router;
