const { Client } = require('pg');
require('dotenv').config();

async function checkTable() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log("Connected to DB");

        const res = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'products'
        `);
        console.log("Columns:", res.rows);

        const constraints = await client.query(`
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints
            WHERE table_name = 'products'
        `);
        console.log("Constraints:", constraints.rows);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.end();
    }
}

checkTable();
