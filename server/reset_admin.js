const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config();

async function resetAdminPassword() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        const email = 'sdfoods2026@gmail.com';
        const newPassword = 'admin123';
        
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);
        
        const result = await client.query(
            "UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email, role",
            [password_hash, email]
        );
        
        if (result.rowCount > 0) {
            console.log('SUCCESS: Password reset for admin user:');
            console.log(JSON.stringify(result.rows[0], null, 2));
            console.log('\nNew Credentials:');
            console.log('Email: ' + email);
            console.log('Password: ' + newPassword);
        } else {
            console.log('ERROR: User ' + email + ' not found.');
        }
    } catch (error) {
        console.error("Error resetting password:", error);
    } finally {
        await client.end();
    }
}

resetAdminPassword();
