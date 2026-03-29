const express = require('express');
const router = express.Router();
const { assignDelivery, updateDeliveryStatus, getDeliveryPartners } = require('../controllers/deliveryController');
const { protect, admin, partner } = require('../middleware/authMiddleware');

router.get('/partners', protect, admin, getDeliveryPartners);
router.post('/assign', protect, admin, assignDelivery);
router.put('/status', protect, partner, updateDeliveryStatus);

module.exports = router;
