const { Client } = require('pg');
require('dotenv').config();

const INITIAL_PINCODES = [
  '500001', '500002', '500003', '500004', '500005', 
  '500032', '500033', '500034', '500081', '500082',
  '500084', '500085', '500089', '500090', '500072'
];

async function migrate() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        
        console.log("Creating delivery_areas table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS delivery_areas (
                id SERIAL PRIMARY KEY,
                pincode VARCHAR(10) UNIQUE NOT NULL,
                area_name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Seeding initial pincodes...");
        for (const pincode of INITIAL_PINCODES) {
            await client.query(
                "INSERT INTO delivery_areas (pincode) VALUES ($1) ON CONFLICT (pincode) DO NOTHING",
                [pincode]
            );
        }

        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await client.end();
    }
}

migrate();
