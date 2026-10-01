const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/categories', menuController.getCategories);
router.post('/categories', verifyToken, verifyRole(['ADMIN']), menuController.addCategory);

router.get('/', menuController.getMenuItems);
router.post('/', verifyToken, verifyRole(['ADMIN', 'MANAGER']), menuController.addMenuItem);
router.put('/:id', verifyToken, verifyRole(['ADMIN', 'MANAGER']), menuController.updateMenuItem);
router.delete('/:id', verifyToken, verifyRole(['ADMIN', 'MANAGER']), menuController.deleteMenuItem);

module.exports = router;
