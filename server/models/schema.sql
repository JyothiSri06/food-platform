-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  phone VARCHAR(20) UNIQUE,
  role VARCHAR(50) DEFAULT 'customer',
  google_id VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  image_url VARCHAR(500)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  product_type VARCHAR(50) DEFAULT 'non-fresh',
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  weight VARCHAR(100),
  food_type VARCHAR(20) DEFAULT 'veg',
  price_250g DECIMAL(10,2),
  price_500g DECIMAL(10,2),
  price_1kg DECIMAL(10,2),
  available_250g BOOLEAN DEFAULT TRUE,
  available_500g BOOLEAN DEFAULT TRUE,
  available_1kg BOOLEAN DEFAULT TRUE,
  discount_percentage INTEGER DEFAULT 0,
  customization_ids JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  order_status VARCHAR(50) DEFAULT 'processing',
  delivery_method VARCHAR(50) NOT NULL,
  shipping_address JSONB,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  status_updates JSONB DEFAULT '[]'::jsonb,
  refund_status VARCHAR(50) DEFAULT 'none',
  refund_id VARCHAR(255),
  customization_notes TEXT,
  customization_choices JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  product_type VARCHAR(50),
  weight VARCHAR(50),
  product_name VARCHAR(255),
  customization_choices JSONB DEFAULT '{}'::jsonb
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL
);

-- Create delivery_partners table
CREATE TABLE IF NOT EXISTS delivery_partners (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'available',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create delivery_areas table
CREATE TABLE IF NOT EXISTS delivery_areas (
  id SERIAL PRIMARY KEY,
  pincode VARCHAR(20) UNIQUE NOT NULL,
  area_name VARCHAR(255),
  delivery_fee DECIMAL(10, 2) DEFAULT 0
);

-- Create local_deliveries table
CREATE TABLE IF NOT EXISTS local_deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  delivery_partner_id INTEGER REFERENCES delivery_partners(id),
  delivery_status VARCHAR(50) DEFAULT 'pending',
  assigned_at TIMESTAMP,
  delivered_at TIMESTAMP
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  shiprocket_order_id VARCHAR(255),
  shiprocket_shipment_id VARCHAR(255),
  tracking_number VARCHAR(255),
  courier_name VARCHAR(255),
  shipping_status VARCHAR(50) DEFAULT 'pending'
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    gateway VARCHAR(50) DEFAULT 'razorpay',
    razorpay_order_id VARCHAR(255),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
