const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, verifyRole(['ADMIN', 'MANAGER']), dashboardController.getStats);
router.get('/public', dashboardController.getPublicStats);

module.exports = router;
