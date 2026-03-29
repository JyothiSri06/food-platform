console.log('STARTING DIAGNOSTIC');
try {
  require('dotenv').config();
  console.log('DOTENV_LOADED');
  const { Pool } = require('pg');
  console.log('PG_LOADED');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log('POOL_CREATED: ', !!process.env.DATABASE_URL);
  pool.query('SELECT 1').then(res => {
    console.log('QUERY_SUCCESS');
    process.exit(0);
  }).catch(err => {
    console.error('QUERY_FAILED: ', err.message);
    process.exit(1);
  });
} catch (e) {
  console.error('FATAL: ', e.message);
  process.exit(1);
}
