const { Client } = require('pg');
require('dotenv').config();

async function testInsert() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log("Connected to DB");

        const name = 'chicken pickle';
        const description = '';
        const price = '550';
        const category = 'All Products, Non-Veg Pickles';
        const product_type = 'packaged';
        const image_url = null;
        const stock = '30';
        const is_available = 'true';
        const weight = '500gm';
        const food_type = 'non-veg';

        const result = await client.query(
            `INSERT INTO products (name, description, price, category, product_type, image_url, stock, is_available, weight, food_type) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [name, description, price, category, product_type, image_url, stock || 0, is_available !== undefined ? is_available : true, weight, food_type || 'veg']
        );

        console.log("Success:", result.rows[0]);
    } catch (error) {
        console.error("Error detected:", error);
    } finally {
        await client.end();
    }
}

testInsert();
