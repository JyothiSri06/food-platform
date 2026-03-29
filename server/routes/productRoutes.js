const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');

// Validation Schemas
const productBodySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0)),
  category: z.string().optional(),
  product_type: z.enum(['fresh', 'packaged', 'kg', 'pieces', 'fixed']).default('packaged'),
  stock: z.preprocess((val) => Number(val || 0), z.number().min(0)).optional(),
  weight: z.string().optional(),
  food_type: z.enum(['veg', 'non-veg']).default('veg').optional(),
  is_available: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  price_250g: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(0).optional()),
  price_500g: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(0).optional()),
  price_1kg: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(0).optional()),
  available_250g: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  available_500g: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  available_1kg: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  discount_percentage: z.preprocess((val) => Number(val || 0), z.number().min(0).max(100)).optional(),
  customization_ids: z.string().optional(), // JSON string from admin
});

const createProductSchema = { body: productBodySchema };
const updateProductSchema = { 
  params: z.object({ id: z.string() }),
  body: productBodySchema.partial() 
};

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, upload.single('image'), validate(createProductSchema), createProduct);
router.put('/:id', protect, admin, upload.single('image'), validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, admin, validate({ params: z.object({ id: z.string() }) }), deleteProduct);

module.exports = router;
