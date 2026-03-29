const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixRole() {
  try {
    const email = 'admin@sdfoods.com';
    const result = await pool.query("UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *", [email]);
    if (result.rowCount > 0) {
      console.log('SUCCESS: Updated user to admin role:');
      console.log(result.rows[0]);
    } else {
      console.log('ERROR: User admin@sdfoods.com not found. Please register this user first.');
    }
  } catch (err) {
    console.error('ERROR updating role:', err.message);
  } finally {
    await pool.end();
  }
}

fixRole();
