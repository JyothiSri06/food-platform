const db = require('../config/db');

// @desc    Get all delivery areas
// @route   GET /api/delivery-areas
// @access  Public
exports.getDeliveryAreas = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM delivery_areas ORDER BY pincode ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving delivery areas' });
    }
};

// @desc    Add a delivery area
// @route   POST /api/delivery-areas
// @access  Private/Admin
exports.addDeliveryArea = async (req, res) => {
    try {
        const { pincode, area_name } = req.body;
        if (!pincode) {
            return res.status(400).json({ message: 'Pincode is required' });
        }
        
        const result = await db.query(
            'INSERT INTO delivery_areas (pincode, area_name) VALUES ($1, $2) ON CONFLICT (pincode) DO NOTHING RETURNING *',
            [pincode, area_name || null]
        );
        
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Pincode already exists' });
        }
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding delivery area' });
    }
};

// @desc    Delete a delivery area
// @route   DELETE /api/delivery-areas/:id
// @access  Private/Admin
exports.deleteDeliveryArea = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM delivery_areas WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Delivery area not found' });
        }
        
        res.json({ message: 'Delivery area removed', area: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error removing delivery area' });
    }
};
