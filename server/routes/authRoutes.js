const express = require('express');
const router = express.Router();
const { register, login, googleLogin, forgotPassword, resetPassword } = require('../controllers/authController');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/securityMiddleware');

// Validation Schemas
const registerSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(100),
    phone: z.string().regex(/^[0-9+ ]{10,20}$/, 'Invalid phone number').optional(),
    role: z.enum(['admin', 'customer']).default('customer').optional(),
  })
};

const loginSchema = {
  body: z.object({
    email: z.string().min(1, 'Email or phone is required'), // Identifier (email or phone)
    password: z.string().min(1, 'Password is required'),
  })
};

const googleLoginSchema = {
  body: z.object({
    idToken: z.string().min(1, 'ID Token is required'),
  })
};

const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
  })
};

const resetPasswordSchema = {
  params: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
  body: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })
};

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google-login', authLimiter, validate(googleLoginSchema), googleLogin);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

module.exports = router;
