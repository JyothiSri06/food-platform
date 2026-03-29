const db = require('../config/db');

async function migrate() {
    try {
        console.log('Starting migration: Adding status_updates to orders table...');
        await db.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS status_updates JSONB DEFAULT '[]'::jsonb;
        `);
        console.log('Migration successful: status_updates column added to orders table.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
