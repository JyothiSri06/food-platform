const express = require('express');
const router = express.Router();
const deliveryAreaController = require('../controllers/deliveryAreaController');
const { protect, admin } = require('../middleware/authMiddleware');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');

// Validation Schemas
const addDeliveryAreaSchema = {
  body: z.object({
    pincode: z.coerce.string().length(6),
    area_name: z.string().max(100).optional(),
  })
};

const deleteDeliveryAreaSchema = {
  params: z.object({ id: z.coerce.number().int().positive() }),
};

// Public route to get all allowed areas
router.get('/', deliveryAreaController.getDeliveryAreas);

// Admin routes
router.post('/', protect, admin, validate(addDeliveryAreaSchema), deliveryAreaController.addDeliveryArea);
router.delete('/:id', protect, admin, validate(deleteDeliveryAreaSchema), deliveryAreaController.deleteDeliveryArea);

module.exports = router;
