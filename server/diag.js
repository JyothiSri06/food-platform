require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('SUCCESS: ', res.rows[0]);
    const settings = await pool.query('SELECT * FROM site_settings LIMIT 1');
    console.log('SETTINGS: ', settings.rows.length);
    process.exit(0);
  } catch (err) {
    console.error('ERROR: ', err.message);
    process.exit(1);
  }
}

run();
