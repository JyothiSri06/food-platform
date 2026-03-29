const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        
        console.log("Adding customization_ids column to products table...");
        await client.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS customization_ids JSONB DEFAULT '[]'::jsonb
        `);

        console.log("Adding customization_choices column to order_items table...");
        await client.query(`
            ALTER TABLE order_items 
            ADD COLUMN IF NOT EXISTS customization_choices JSONB DEFAULT '{}'::jsonb
        `);

        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await client.end();
    }
}

migrate();
