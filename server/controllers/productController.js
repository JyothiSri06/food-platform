const db = require('../config/db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    res.status(500).json({ message: 'Server error retrieving products', details: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET_PRODUCT_BY_ID_ERROR:", error);
    res.status(500).json({ message: 'Server error retrieving product', details: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  console.log("CREATE_PRODUCT_START: Body =", req.body);
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      product_type, 
      stock, 
      weight,
      food_type,
      is_available,
      price_250g,
      price_500g,
      price_1kg,
      available_250g,
      available_500g,
      available_1kg,
      discount_percentage,
      customization_ids
    } = req.body;

    // 1. Data Validation
    if (!name || !price || !product_type) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['name', 'price', 'product_type'] 
      });
    }

    // 2. Optional Image Handling
    let image_url = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        image_url = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("CLOUDINARY_UPLOAD_FAILURE:", uploadError);
        // We continue without image if upload fails, or we could return error
        // For now, let's treat it as a hard failure if they tried to upload but it failed
        return res.status(500).json({ message: 'Failed to upload image', details: uploadError.message });
      }
    }

    // 3. Normalized values for SQL
    const values = [
      name.trim(),
      description ? description.trim() : null,
      parseFloat(price),
      Array.isArray(category) ? category.join(', ') : (category || null),
      product_type,
      image_url,
      parseInt(stock) || 0,
      weight ? weight.trim() : null,
      food_type || 'veg',
      is_available === 'true' || is_available === true,
      price_250g && price_250g !== "" ? parseFloat(price_250g) : parseFloat(price),
      price_500g && price_500g !== "" ? parseFloat(price_500g) : parseFloat(price),
      price_1kg && price_1kg !== "" ? parseFloat(price_1kg) : parseFloat(price),
      available_250g !== undefined ? (available_250g === 'true' || available_250g === true) : true,
      available_500g !== undefined ? (available_500g === 'true' || available_500g === true) : true,
      available_1kg !== undefined ? (available_1kg === 'true' || available_1kg === true) : true,
      parseInt(discount_percentage) || 0,
      customization_ids ? (Array.isArray(customization_ids) ? JSON.stringify(customization_ids) : customization_ids) : '[]'
    ];

    console.log("INSERT_VALUES:", values);

    // 4. Database Operation (8 fields as requested)
    const query = `
      INSERT INTO products (
        name, description, price, category, product_type, image_url, stock, weight, food_type, is_available,
        price_250g, price_500g, price_1kg,
        available_250g, available_500g, available_1kg, discount_percentage, customization_ids
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
      RETURNING *
    `;

    const result = await db.query(query, values);
    console.log("INSERT_SUCCESS:", result.rows[0].id);
    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("PRODUCT_CREATE_FATAL:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Failed to create product record', 
      details: error.message,
      code: error.code 
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      category, 
      product_type, 
      stock, 
      weight,
      food_type,
      is_available,
      price_250g,
      price_500g,
      price_1kg,
      available_250g,
      available_500g,
      available_1kg,
      discount_percentage,
      customization_ids
    } = req.body;

    // 1. Fetch existing record
    const existingResult = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const current = existingResult.rows[0];

    // 2. Optional Image Handling
    let image_url = current.image_url;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      image_url = uploadResult.secure_url;
    }

    // 3. SQL Operation with explicit parameters
    const query = `
      UPDATE products 
      SET 
        name = $1, description = $2, price = $3, category = $4, 
        product_type = $5, image_url = $6, stock = $7, weight = $8,
        food_type = $9, is_available = $10,
        price_250g = $11, price_500g = $12, price_1kg = $13,
        available_250g = $14, available_500g = $15, available_1kg = $16,
        discount_percentage = $17, customization_ids = $18
      WHERE id = $19 
      RETURNING *
    `;

    const values = [
      name !== undefined ? name.trim() : current.name,
      description !== undefined ? description.trim() : current.description,
      price !== undefined ? parseFloat(price) : current.price,
      category !== undefined ? (Array.isArray(category) ? category.join(', ') : category) : current.category,
      product_type || current.product_type,
      image_url,
      stock !== undefined ? parseInt(stock) : current.stock,
      weight !== undefined ? weight.trim() : current.weight,
      food_type || current.food_type,
      is_available !== undefined ? (is_available === 'true' || is_available === true) : current.is_available,
      (price_250g !== undefined && price_250g !== "" && price_250g !== null) ? parseFloat(price_250g) : current.price_250g,
      (price_500g !== undefined && price_500g !== "" && price_500g !== null) ? parseFloat(price_500g) : current.price_500g,
      (price_1kg !== undefined && price_1kg !== "" && price_1kg !== null) ? parseFloat(price_1kg) : current.price_1kg,
      available_250g !== undefined ? (available_250g === 'true' || available_250g === true) : current.available_250g,
      available_500g !== undefined ? (available_500g === 'true' || available_500g === true) : current.available_500g,
      available_1kg !== undefined ? (available_1kg === 'true' || available_1kg === true) : current.available_1kg,
      (discount_percentage !== undefined && discount_percentage !== "" && discount_percentage !== null) ? parseInt(discount_percentage) : (current.discount_percentage || 0),
      customization_ids !== undefined ? (Array.isArray(customization_ids) ? JSON.stringify(customization_ids) : customization_ids) : current.customization_ids,
      id
    ];

    const result = await db.query(query, values);
    res.json(result.rows[0]);

  } catch (error) {
    console.error("PRODUCT_UPDATE_ERROR:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      id: req.params.id
    });
    res.status(500).json({ 
      message: 'Failed to update product record', 
      details: error.message,
      code: error.code
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};
