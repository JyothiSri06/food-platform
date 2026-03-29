const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env to avoid dependency issues
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);

if (!dbUrlMatch) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
}

const databaseUrl = dbUrlMatch[1].trim();

async function checkUsers() {
    const client = new Client({
        connectionString: databaseUrl,
    });

    try {
        await client.connect();
        const res = await client.query('SELECT id, name, email, role FROM users');
        console.log('--- Users in Database ---');
        console.table(res.rows);
        
        const adminUser = res.rows.find(u => u.email === 'admin@sdfoods.com');
        if (adminUser && adminUser.role !== 'admin') {
            console.log('\nFixing admin role for admin@sdfoods.com...');
            await client.query("UPDATE users SET role = 'admin' WHERE email = 'admin@sdfoods.com'");
            console.log('Admin role updated successfully!');
        } else if (!adminUser) {
            console.log('\nAdmin user not found. Please check seeding or register.');
        } else {
            console.log('\nAdmin user already has correct role.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkUsers();
