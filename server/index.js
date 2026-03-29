require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const validateEnv = require('./config/envValidator');
const { 
  securityHeaders, 
  apiLimiter, 
  parameterPollution, 
  dataSanitization 
} = require('./middleware/securityMiddleware');

// Global Process Error Handlers to prevent silent death
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err.name, err.message, err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...', err.name, err.message, err.stack);
    process.exit(1);
});

// Validate Environment Variables before starting
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting (important for production/load balancers)
app.set('trust proxy', 1);

// Security and Performance Middleware
app.use(compression()); // Compress all responses
app.use(securityHeaders); // Secure headers with Helmet
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Express 5 Compatibility: Make req.query and req.params writable for middlewares that mutate them
app.use((req, res, next) => {
    const query = req.query;
    const params = req.params;
    Object.defineProperty(req, 'query', { value: query, writable: true, configurable: true });
    Object.defineProperty(req, 'params', { value: params, writable: true, configurable: true });
    next();
});

app.use(express.json({ limit: '1mb' })); // Request size limiting
app.use(parameterPollution); // Prevent HTTP Parameter Pollution
app.use(dataSanitization); // Prevent NoSQL/JSON/Injection in payloads
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Global Rate Limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/shipping', require('./routes/shippingRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/delivery-areas', require('./routes/deliveryAreaRoutes'));
app.use('/api/customizations', require('./routes/customizationRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Basic health route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Jeji Vantalu API running' });
});

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
    // Disconnected: Frontend is now hosted separately.
    // This backend operates purely as a data API.
}

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    const isProd = process.env.NODE_ENV === 'production';
    res.status(err.status || 500).json({
        error: isProd ? 'An unexpected error occurred' : err.message,
        details: isProd ? undefined : err.stack
    });
});

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
