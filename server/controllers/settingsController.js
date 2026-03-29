const db = require('../config/db');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getSettings = async (req, res) => {
    try {
        const result = await db.query('SELECT key, value FROM site_settings');
        const settings = {};
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });
        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err.message);
        res.status(500).json({ error: 'Server error fetching site settings' });
    }
};

exports.updateSettings = async (req, res) => {
    let settings = {};
    
    // Handle JSON settings if present
    if (req.body.settings) {
        try {
            settings = typeof req.body.settings === 'string' 
                ? JSON.parse(req.body.settings) 
                : req.body.settings;
        } catch (e) {
            console.error('JSON parse error for settings:', e);
        }
    } else {
        // Fallback for flat fields if sent directly in body (multipart/form-data)
        settings = { ...req.body };
    }
    
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        
        // Handle file uploads if present
        if (req.files) {
            if (req.files.logo && req.files.logo[0]) {
                const logoResult = await uploadToCloudinary(req.files.logo[0].buffer, 'image');
                settings.logo_url = logoResult.secure_url;
            }
            if (req.files.hero_video && req.files.hero_video[0]) {
                const videoResult = await uploadToCloudinary(req.files.hero_video[0].buffer, 'auto');
                settings.hero_video_url = videoResult.secure_url;
            }
            if (req.files.company_seal && req.files.company_seal[0]) {
                const sealResult = await uploadToCloudinary(req.files.company_seal[0].buffer, 'image');
                settings.company_seal_url = sealResult.secure_url;
            }
        }

        for (const [key, value] of Object.entries(settings)) {
            if (value === undefined || value === null) continue;
            
            await client.query(
                'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
                [key, String(value)]
            );
        }
        
        await client.query('COMMIT');
        res.json({ message: 'Settings updated successfully', settings });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating settings:', err.message);
        res.status(500).json({ error: 'Server error updating site settings' });
    } finally {
        client.release();
    }
};
