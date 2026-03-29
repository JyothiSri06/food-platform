const db = require('./food-platform/server/config/db');

async function updateSchema() {
    try {
        console.log("Checking for google_id column...");
        const checkRes = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'google_id'");
        
        if (checkRes.rows.length === 0) {
            console.log("Adding google_id column...");
            await db.query("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE");
            console.log("Column added successfully.");
        } else {
            console.log("google_id column already exists.");
        }

        console.log("Ensuring phone is nullable...");
        await db.query("ALTER TABLE users ALTER COLUMN phone DROP NOT NULL");
        console.log("Phone column updated.");

    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        process.exit();
    }
}

updateSchema();
