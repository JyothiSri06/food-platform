const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config();

async function run() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('admin123', salt);
        
        // Ensure user exists or update
        const email = 'admin@jejivantalu.com';
        const check = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            await client.query("UPDATE users SET password_hash = $1, role = 'admin' WHERE email = $2", [hash, email]);
        } else {
            await client.query("INSERT INTO users (name, email, password_hash, role) VALUES ('Demo Admin', $1, $2, 'admin')", [email, hash]);
        }
        
        console.log('--- ADMIN CAPTURED ---');
        console.log('Email: ' + email);
        console.log('Password: admin123');
        console.log('----------------------');
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.end();
    }
}

run();
