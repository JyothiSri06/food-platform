const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function diagnose() {
  console.log('--- Database Diagnosis ---');
  try {
    const tableRes = await pool.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position;
    `);
    console.log('Products Table Columns:');
    tableRes.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (${col.character_maximum_length || ''})`);
    });
  } catch (err) {
    console.error('Database Error:', err.message);
  }

  console.log('\n--- Cloudinary Diagnosis ---');
  try {
    const res = await cloudinary.api.ping();
    console.log('Cloudinary Connection: OK', res);
  } catch (err) {
    console.error('Cloudinary Error:', err.message);
  }

  console.log('\n--- Category Consistency Check ---');
  try {
    const catRes = await pool.query('SELECT name FROM categories');
    const prodCatRes = await pool.query('SELECT DISTINCT category FROM products');
    const dbCategories = catRes.rows.map(r => r.name.toLowerCase());
    const productCategories = prodCatRes.rows.flatMap(r => r.category ? r.category.split(',').map(c => c.trim().toLowerCase()) : []);
    const uniqueProductCategories = [...new Set(productCategories)];
    
    console.log('Categories in "categories" table:', dbCategories.join(', '));
    console.log('Categories used in "products" table:', uniqueProductCategories.join(', '));
    
    const mismatches = uniqueProductCategories.filter(c => !dbCategories.includes(c));
    if (mismatches.length > 0) {
      console.warn('Mismatches found (Products using categories not in categories table):', mismatches.join(', '));
    } else {
      console.log('Category consistency check passed.');
    }
  } catch (err) {
    console.error('Consistency Check Error:', err.message);
  }

  await pool.end();
}

diagnose();
