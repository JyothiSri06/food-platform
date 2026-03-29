const { Pool } = require('pg');
require('dotenv').config({ path: './food-platform/server/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updatePrices() {
  try {
    const res = await pool.query(`
      UPDATE products 
      SET 
        price_250g = 275, 
        price_500g = 525, 
        price_1kg = 999 
      WHERE name ILIKE '%chicken pickle%'
      RETURNING name, price_250g, price_500g, price_1kg
    `);
    console.log('Updated Prices:', res.rows);
  } catch (err) {
    console.error('Error updating prices:', err);
  } finally {
    await pool.end();
  }
}

updatePrices();
