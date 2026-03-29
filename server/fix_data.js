const { Client } = require('pg');
require('dotenv').config();

async function fixData() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        
        // Fix pulum cake typo
        await client.query("UPDATE products SET name = 'Plum Cake' WHERE name = 'pulum cake'");
        console.log("Updated 'pulum cake' to 'Plum Cake'");

        // Fix Ghee image URL - setting it to a valid placeholder to see if it fixes the console error
        await client.query("UPDATE products SET image_url = 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80' WHERE name = 'Ghee'");
        console.log("Updated 'Ghee' image URL");

        // Verify changes
        const res = await client.query("SELECT id, name, image_url FROM products WHERE name IN ('Plum Cake', 'Ghee')");
        console.table(res.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

fixData();
