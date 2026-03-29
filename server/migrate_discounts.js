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
      ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;
    `);
    
    console.log('Discount column added successfully');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    await client.end();
  }
}

run();
