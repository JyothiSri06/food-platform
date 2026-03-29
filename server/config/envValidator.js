const { z } = require('zod');

/**
 * Validates required environment variables at startup.
 * Fails fast if any are missing or malformed.
 */
const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET should be at least 32 characters'),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  PAYTM_MERCHANT_ID: z.string().optional(),
  PAYTM_MERCHANT_KEY: z.string().optional(),
  SHIPROCKET_EMAIL: z.string().email().optional(),
  SHIPROCKET_PASSWORD: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function validateEnv() {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully.');
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment Variable Validation Errors:');
      error.errors.forEach(err => {
        console.error(`   - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

module.exports = validateEnv;
