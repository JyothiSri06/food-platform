const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');
const adminUpload = require('../middleware/adminUploadMiddleware');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');

// Validation Schemas
const updateSettingsSchema = {
  body: z.object({
    settings: z.string().optional(), // Can be stringified JSON
    // individual flat fields if any
    business_name: z.string().max(100).optional(),
    business_email: z.string().email().optional(),
    business_phone: z.string().max(20).optional(),
    help_message: z.string().max(500).optional(),
  }).passthrough() // Allow other setting keys
};

// Public route to get site settings
router.get('/', settingsController.getSettings);

// Admin only route to update site settings
router.put('/', protect, admin, adminUpload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'hero_video', maxCount: 1 },
    { name: 'company_seal', maxCount: 1 }
]), validate(updateSettingsSchema), settingsController.updateSettings);

module.exports = router;
