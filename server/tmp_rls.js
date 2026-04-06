const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' }); // Make sure we load the right .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase requires SSL usually
});

const run = async () => {
    console.log("Attempting to connect to:", process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'No DB URL found');
    try {
        await pool.query(`
            ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS delivery_partners ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS delivery_areas ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS local_deliveries ENABLE ROW LEVEL SECURITY;
            ALTER TABLE IF EXISTS shipments ENABLE ROW LEVEL SECURITY;
        `);
        console.log("RLS successfully enabled on all tables.");
    } catch(err) {
        console.error("Error enabling RLS:", err.message);
    } finally {
        pool.end();
    }
};
run();
