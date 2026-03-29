const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runTest() {
  const resultFile = 'db_test_result.txt';
  let output = 'Starting DB Diagnostic...\n';
  
  try {
    output += 'Connecting to pool...\n';
    const client = await pool.connect();
    output += 'Connected successfully.\n';
    
    output += 'Checking products table...\n';
    const productsRes = await client.query('SELECT count(*) FROM products');
    output += `Products count: ${productsRes.rows[0].count}\n`;
    
    output += 'Checking categories table...\n';
    const categoriesRes = await client.query('SELECT count(*) FROM categories');
    output += `Categories count: ${categoriesRes.rows[0].count}\n`;
    
    output += 'Checking site_settings table...\n';
    const settingsRes = await client.query('SELECT count(*) FROM site_settings');
    output += `Settings count: ${settingsRes.rows[0].count}\n`;
    
    client.release();
    output += 'Diagnostic completed successfully.\n';
  } catch (err) {
    output += `DIAGNOSTIC FAILED: ${err.message}\n`;
    output += `Stack: ${err.stack}\n`;
  }
  
  fs.writeFileSync(resultFile, output);
  console.log('Results written to', resultFile);
  process.exit(0);
}

runTest();
