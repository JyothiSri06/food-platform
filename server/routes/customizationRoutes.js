const express = require('express');
const router = express.Router();
const { 
  getCustomizations, 
  getAllCustomizationsAdmin, 
  createCustomization, 
  updateCustomization, 
  deleteCustomization 
} = require('../controllers/customizationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');

// Validation Schemas
const customizationSchema = z.object({
  name: z.string().min(2).max(100),
  options: z.array(z.string().min(1).max(50)).min(1),
  is_active: z.boolean().optional(),
});

const createCustomizationSchema = { body: customizationSchema };
const updateCustomizationSchema = {
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: customizationSchema.partial(),
};

const deleteCustomizationSchema = {
  params: z.object({ id: z.coerce.number().int().positive() }),
};

router.get('/', getCustomizations);
router.get('/admin', protect, admin, getAllCustomizationsAdmin);
router.post('/', protect, admin, validate(createCustomizationSchema), createCustomization);
router.put('/:id', protect, admin, validate(updateCustomizationSchema), updateCustomization);
router.delete('/:id', protect, admin, validate(deleteCustomizationSchema), deleteCustomization);

module.exports = router;
