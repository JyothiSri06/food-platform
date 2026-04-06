const express = require('express');
const router = express.Router();
const routeOptimizationController = require('../controllers/routeOptimizationController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route purely for route optimization API logic - restricted to admin
router.post('/', protect, admin, routeOptimizationController.optimizeRoute);

// For testing purposes during deployment without token (optional, remove in strict production)
router.post('/test', routeOptimizationController.optimizeRoute);

module.exports = router;
