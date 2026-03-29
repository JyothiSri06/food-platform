const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  trackOrder,
  updateOrder,
  cancelOrder,
  processRefund
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');

// Validation Schemas
const orderItemSchema = z.object({
  product_id: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().min(0),
  product_type: z.string(), // Flexible to support fresh, packaged, etc.
  weight: z.string().optional().nullable(),
  name: z.string().min(1).max(255).optional().nullable(),
  customization_choices: z.record(z.any()).optional(),
  image_url: z.string().optional().nullable(),
  cartId: z.any().optional(),
});

const shippingAddressSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  altPhone: z.string().optional().nullable(),
  addressLine1: z.string().min(1).max(500),
  addressLine2: z.string().optional().nullable(),
  landmark: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  village: z.string().min(2).max(100).optional().nullable(),
  pincode: z.coerce.string().length(6),
  postalCode: z.coerce.string().optional(),
  state: z.string().min(2).max(100).optional().nullable(),
});

const addOrderSchema = {
  body: z.object({
    orderItems: z.array(orderItemSchema).min(1),
    shippingAddress: shippingAddressSchema,
    totalAmount: z.coerce.number().min(0),
    paymentMethod: z.string().optional(),
    deliveryFee: z.coerce.number().min(0).optional(),
    discount: z.coerce.number().min(0).optional(),
    customization_notes: z.string().max(1000).optional().nullable(),
    customization_choices: z.record(z.any()).optional(),
  })
};

const trackOrderSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  })
};

const getOrderByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  })
};

router.post('/', protect, validate(addOrderSchema), addOrderItems);
router.get('/', protect, admin, getOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/track/:id', validate(trackOrderSchema), trackOrder);
router.get('/:id', protect, validate(getOrderByIdSchema), getOrderById);
router.put('/:id/pay', protect, validate(getOrderByIdSchema), updateOrderToPaid);
router.put('/:id/cancel', protect, validate(getOrderByIdSchema), cancelOrder);
router.put('/:id/refund', protect, admin, validate(getOrderByIdSchema), processRefund);
router.put('/:id', protect, admin, validate(getOrderByIdSchema), updateOrder);

module.exports = router;
