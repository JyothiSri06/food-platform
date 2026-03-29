const express = require('express');
const router = express.Router();
const { createShipment, trackShipment } = require('../controllers/shippingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create', protect, admin, createShipment);
router.get('/track/:id', protect, trackShipment);

module.exports = router;
