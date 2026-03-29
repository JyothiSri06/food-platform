const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sdfoods',
  password: 'jyothisri06',
  port: 5432,
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS weight VARCHAR(100),
      ADD COLUMN IF NOT EXISTS food_type VARCHAR(20) DEFAULT 'veg';
    `);
    
    console.log('Columns added successfully');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    await client.end();
  }
}

run();
