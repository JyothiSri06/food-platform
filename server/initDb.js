const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDb() {
    console.log("Starting database initialization...");
    const defaultClient = new Client({
        connectionString: 'postgresql://postgres:jyothisri06@localhost:5432/postgres'
    });
    
    try {
        await defaultClient.connect();
        const res = await defaultClient.query("SELECT 1 FROM pg_database WHERE datname='sdfoods'");
        if (res.rowCount === 0) {
            console.log("Database 'sdfoods' does not exist. Creating...");
            await defaultClient.query('CREATE DATABASE sdfoods');
            console.log("Database 'sdfoods' created.");
        } else {
            console.log("Database 'sdfoods' already exists.");
        }
    } catch (error) {
        console.error("Error creating database (it may already exist or postgres is not running):", error.message);
    } finally {
        await defaultClient.end();
    }

    console.log("Connecting to sdfoods to load schema...");
    const sdfoodsClient = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await sdfoodsClient.connect();
        const schema = fs.readFileSync(path.join(__dirname, 'models', 'schema.sql'), 'utf8');
        await sdfoodsClient.query(schema);
        console.log("Schema loaded successfully.");
    } catch (error) {
        console.error("Error loading schema:", error.message);
    } finally {
        await sdfoodsClient.end();
    }
}

initDb();
