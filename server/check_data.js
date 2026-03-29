const { Client } = require('pg');
require('dotenv').config();

async function checkData() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        const res = await client.query("SELECT id, name, image_url FROM products");
        console.log('--- Products Data ---');
        console.table(res.rows);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkData();
