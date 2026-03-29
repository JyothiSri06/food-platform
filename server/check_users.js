const { Client } = require('pg');
require('dotenv').config();

async function checkUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    const result = await client.query("SELECT id, name, email, role FROM users WHERE role = 'admin'");
    console.log('ADMIN USERS:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    if (result.rowCount === 0) {
      const allUsers = await client.query("SELECT id, name, email, role FROM users LIMIT 10");
      console.log('NO ADMIN FOUND. ALL USERS (First 10):');
      console.log(JSON.stringify(allUsers.rows, null, 2));
    }
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await client.end();
  }
}

checkUsers();
