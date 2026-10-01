const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(verifyRole(['ADMIN']));

router.get('/', staffController.getAllStaff);
router.post('/', staffController.addStaff);
router.put('/:id', staffController.updateStaff);
router.put('/:id/status', staffController.changeStatus);
router.put('/:id/role', staffController.changeRole);

module.exports = router;
