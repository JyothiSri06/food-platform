const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env to avoid dependency issues
const envPath = path.join(__dirname, '../server/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);

if (!dbUrlMatch) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
}

const databaseUrl = dbUrlMatch[1].trim();

async function updateAdmin() {
    const client = new Client({
        connectionString: databaseUrl,
    });

    try {
        await client.connect();
        
        // Find users that might be the admin
        const searchRes = await client.query("SELECT id, name, email, role FROM users WHERE email LIKE '%sdfoods%' OR name LIKE '%sdfoods%'");
        console.log('--- Potential Admin Users ---');
        console.table(searchRes.rows);

        if (searchRes.rows.length > 0) {
            const adminId = searchRes.rows[0].id; // Update the first one found
            const oldEmail = searchRes.rows[0].email;
            const newEmail = 'jejivantalu@gmail.com';
            const newName = 'Jeji Vantalu';

            await client.query("UPDATE users SET email = $1, name = $2, role = 'admin' WHERE id = $3", [newEmail, newName, adminId]);
            console.log(`Successfully updated admin (ID: ${adminId}) from ${oldEmail} to ${newEmail}`);
        } else {
            // Also check for 'admin@sdfoods.com' specifically
            const adminRes = await client.query("SELECT id FROM users WHERE email = 'admin@sdfoods.com'");
            if (adminRes.rows.length > 0) {
                await client.query("UPDATE users SET email = 'jejivantalu@gmail.com', name = 'Jeji Vantalu', role = 'admin' WHERE id = $1", [adminRes.rows[0].id]);
                 console.log(`Successfully updated admin@sdfoods.com to jejivantalu@gmail.com`);
            } else {
                console.log('No user found matching SD Foods. Check the database manually.');
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

updateAdmin();
