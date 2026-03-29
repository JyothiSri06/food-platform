const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.NODE_ENV === 'production' && { ssl: { rejectUnauthorized: false } })
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

const query = async (text, params) => {
    try {
        return await pool.query(text, params);
    } catch (err) {
        console.error('DB_QUERY_ERROR:', { text: text.substring(0, 50), message: err.message });
        throw err;
    }
};

const runMigration = async (label, sql) => {
    try {
        await pool.query(sql);
        console.log(`[Migration] SUCCESS: ${label}`);
    } catch (err) {
        console.error(`[Migration] FAILED: ${label} - ${err.message}`);
    }
};

(async () => {
    try {
        console.log('Starting full database synchronization...');
        
        // 1. Tables Creation
        await runMigration('Core Tables', `
            CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL);
            CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL);
            CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, price DECIMAL(10,2) NOT NULL);
            CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), total_amount DECIMAL(10,2) NOT NULL);
            CREATE TABLE IF NOT EXISTS order_items (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE);
            CREATE TABLE IF NOT EXISTS site_settings (key VARCHAR(100) PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS payments (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, amount DECIMAL(10,2) NOT NULL);
        `);

        // 2. Incremental Columns (Robust)
        await runMigration('Users Columns', `
            ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';
            ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP WITH TIME ZONE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        `);

        await runMigration('Products Columns', `
            ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
            ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);
            ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type VARCHAR(50) DEFAULT 'non-fresh';
            ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
            ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
            ALTER TABLE products ADD COLUMN IF NOT EXISTS weight VARCHAR(100);
            ALTER TABLE products ADD COLUMN IF NOT EXISTS food_type VARCHAR(20) DEFAULT 'veg';
            ALTER TABLE products ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;
            ALTER TABLE products ADD COLUMN IF NOT EXISTS price_250g DECIMAL(10,2);
            ALTER TABLE products ADD COLUMN IF NOT EXISTS price_500g DECIMAL(10,2);
            ALTER TABLE products ADD COLUMN IF NOT EXISTS price_1kg DECIMAL(10,2);
            ALTER TABLE products ADD COLUMN IF NOT EXISTS available_250g BOOLEAN DEFAULT TRUE;
            ALTER TABLE products ADD COLUMN IF NOT EXISTS available_500g BOOLEAN DEFAULT TRUE;
            ALTER TABLE products ADD COLUMN IF NOT EXISTS available_1kg BOOLEAN DEFAULT TRUE;
            ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;
            ALTER TABLE products ADD COLUMN IF NOT EXISTS customization_ids JSONB DEFAULT '[]';
            ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        `);

        await runMigration('Orders Columns', `
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status VARCHAR(20) DEFAULT 'processing';
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(20) DEFAULT 'courier';
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0.00;
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0.00;
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updates JSONB DEFAULT '[]'::jsonb;
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_status VARCHAR(20) DEFAULT 'none';
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_id VARCHAR(255);
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS customization_notes TEXT;
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS customization_choices JSONB DEFAULT '{}'::jsonb;
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        `);

        await runMigration('Payments Columns', `
            ALTER TABLE payments ADD COLUMN IF NOT EXISTS gateway VARCHAR(50) DEFAULT 'razorpay';
            ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';
            ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255);
            ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);
            ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        `);

        await runMigration('Order Items Columns', `
            ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_id INTEGER;
            ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
            ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
            ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_type VARCHAR(50);
            ALTER TABLE order_items ADD COLUMN IF NOT EXISTS weight VARCHAR(50);
            ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);
            ALTER TABLE order_items ADD COLUMN IF NOT EXISTS customization_choices JSONB DEFAULT '{}'::jsonb;
        `);

        // 3. Aux Tables & Indexes
        await runMigration('Misc', `
            CREATE TABLE IF NOT EXISTS delivery_partners (id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE, status VARCHAR(20) DEFAULT 'available', updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS delivery_areas (id SERIAL PRIMARY KEY, pincode VARCHAR(20) UNIQUE NOT NULL, area_name VARCHAR(255));
            ALTER TABLE delivery_areas ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0;
            CREATE TABLE IF NOT EXISTS local_deliveries (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, delivery_partner_id INTEGER REFERENCES delivery_partners(id), delivery_status VARCHAR(50) DEFAULT 'pending', assigned_at TIMESTAMP, delivered_at TIMESTAMP);
            CREATE TABLE IF NOT EXISTS shipments (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, shiprocket_order_id VARCHAR(255), shiprocket_shipment_id VARCHAR(255), tracking_number VARCHAR(255), courier_name VARCHAR(255), shipping_status VARCHAR(50) DEFAULT 'pending');
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
            CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
        `);

        // 4. Seed
        await query(`INSERT INTO site_settings (key, value) VALUES 
            ('business_name', 'Jeji Vantalu'),
            ('business_address', '12-3-456, Kitchen Lane, Telangana, India'),
            ('business_phone', '+91 90000 00000'),
            ('business_email', 'info@jejivantalu.com'),
            ('hero_website', 'jejivantalu.in'),
            ('hero_title', 'From Our Kitchen to Your Cravings'),
            ('hero_description', 'Delicious Homemade Foods')
            ON CONFLICT (key) DO NOTHING`);

        // 5. Default Delivery Area Seeding (for testing)
        await query(`INSERT INTO delivery_areas (pincode, area_name, delivery_fee) 
            VALUES ('500001', 'Hyderabad Central', 50) 
            ON CONFLICT (pincode) DO NOTHING`);

        console.log('Database synchronization complete.');
    } catch (err) {
        console.error('DATABASE_INIT_FATAL:', err.message);
    }
})();

module.exports = { query, getClient: () => pool.connect(), pool };
