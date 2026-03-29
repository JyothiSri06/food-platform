const { z } = require('zod');

/**
 * Validates request data against Zod schemas.
 * @param {Object} schemas - Schema object containing body, query, and params as Zod schemas.
 */
const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    next();
  } catch (error) {
    console.error('VALIDATION_MIDDLEWARE_ERROR:', error);
    if (error.name === 'ZodError' || error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    res.status(500).json({ error: 'Internal Server Error during validation' });
  }
};

module.exports = validate;
