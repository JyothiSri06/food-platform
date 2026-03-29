const db = require('../config/db');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getCategories = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error("GET_CATEGORIES_ERROR:", error);
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        console.log("ADD_CATEGORY_BODY:", req.body);
        console.log("ADD_CATEGORY_FILE:", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : "No file");

        const { name } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
          console.log("Uploading to Cloudinary...");
          const result = await uploadToCloudinary(req.file.buffer);
          console.log("Cloudinary Result:", result.secure_url);
          image_url = result.secure_url;
        }

        const result = await db.query(
            'INSERT INTO categories (name, image_url) VALUES ($1, $2) RETURNING *',
            [name, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("ADD_CATEGORY_ERROR:", error);
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        console.log("UPDATE_CATEGORY_ID:", id);
        console.log("UPDATE_CATEGORY_BODY:", req.body);
        console.log("UPDATE_CATEGORY_FILE:", req.file ? "File present" : "No file");

        const existingCategory = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (existingCategory.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        let image_url = req.body.image_url || existingCategory.rows[0].image_url;

        if (req.file) {
          console.log("Uploading update to Cloudinary...");
          const result = await uploadToCloudinary(req.file.buffer);
          console.log("Cloudinary update result:", result.secure_url);
          image_url = result.secure_url;
        }

        const updateName = name || existingCategory.rows[0].name;

        const result = await db.query(
            'UPDATE categories SET name = $1, image_url = $2 WHERE id = $3 RETURNING *',
            [updateName, image_url, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("UPDATE_CATEGORY_ERROR:", error);
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
