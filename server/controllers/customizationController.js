const db = require('../config/db');

// @desc    Get all active customization options
// @route   GET /api/customizations
// @access  Public
exports.getCustomizations = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM customization_options WHERE is_active = true ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customizations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all customization options (including inactive)
// @route   GET /api/customizations/admin
// @access  Private/Admin
exports.getAllCustomizationsAdmin = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM customization_options ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all customizations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new customization category
// @route   POST /api/customizations
// @access  Private/Admin
exports.createCustomization = async (req, res) => {
  const { name, options } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO customization_options (name, options) VALUES ($1, $2) RETURNING *',
      [name, JSON.stringify(options)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating customization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update customization category
// @route   PUT /api/customizations/:id
// @access  Private/Admin
exports.updateCustomization = async (req, res) => {
  const { id } = req.params;
  const { name, options, is_active } = req.body;
  try {
    const result = await db.query(
      'UPDATE customization_options SET name = $1, options = $2, is_active = $3 WHERE id = $4 RETURNING *',
      [name, JSON.stringify(options), is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Customization not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating customization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete customization category
// @route   DELETE /api/customizations/:id
// @access  Private/Admin
exports.deleteCustomization = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM customization_options WHERE id = $1', [id]);
    res.json({ message: 'Customization removed' });
  } catch (error) {
    console.error('Error deleting customization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
