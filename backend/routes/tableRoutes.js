const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/', tableController.getTables);
router.post('/', verifyToken, verifyRole(['ADMIN']), tableController.addTable);
router.put('/:id/status', verifyToken, tableController.updateTableStatus);

module.exports = router;
