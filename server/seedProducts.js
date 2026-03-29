const { Client } = require('pg');
require('dotenv').config();

const products = [
  {
    name: 'Black Forest Cake',
    description: 'Classic chocolate sponge cake layered with cherry filling and whipped cream, topped with chocolate shavings.',
    price: 650,
    category: 'cakes',
    product_type: 'fresh',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 10,
    is_available: true
  },
  {
    name: 'Red Velvet Cake',
    description: 'Moist red velvet cake layers with smooth cream cheese frosting. A visual and culinary delight.',
    price: 750,
    category: 'cakes',
    product_type: 'fresh',
    image_url: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 8,
    is_available: true
  },
  {
    name: 'Premium Assorted Cookies Box',
    description: 'A delightful assortment of handmade butter, chocolate chip, and oatmeal cookies.',
    price: 450,
    category: 'cookies',
    product_type: 'packaged',
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 50,
    is_available: true
  },
  {
    name: 'Spicy Mango Pickle (500g)',
    description: 'Authentic South Indian style spicy, tangy, and flavorsome mango pickle.',
    price: 300,
    category: 'pickles',
    product_type: 'packaged',
    image_url: 'https://images.unsplash.com/photo-1627308595186-b1fbcf4ee1f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 30,
    is_available: true
  },
  {
    name: 'Fresh Croissants (Half Dozen)',
    description: 'Buttery, flaky, and freshly baked croissants made with premium French butter.',
    price: 250,
    category: 'bakery',
    product_type: 'fresh',
    image_url: 'https://images.unsplash.com/photo-1555507036-1215c2d3fb84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stock: 15,
    is_available: true
  }
];

async function seed() {
  console.log("Connecting to database...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    
    console.log("Seeding products...");
    for (let product of products) {
      await client.query(
        `INSERT INTO products (name, description, price, category, product_type, image_url, stock, is_available) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [product.name, product.description, product.price, product.category, product.product_type, product.image_url, product.stock, product.is_available]
      );
    }
    
    console.log("Seeding an admin and a delivery partner user for testing...");
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passHub = await bcrypt.hash('admin123', salt);
    
    await client.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ('SD Foods', 'sdfoods2026@gmail.com', $1, 'admin') ON CONFLICT DO NOTHING",
        [passHub]
    );
    await client.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ('Delivery Guy', 'delivery@sdfoods.com', $1, 'delivery_partner') ON CONFLICT DO NOTHING",
        [passHub]
    );

    console.log("Seed complete! You can now login with sdfoods2026@gmail.com / admin123 or delivery@sdfoods.com / admin123");
  } catch (error) {
    console.error("Error seeding:", error.message);
  } finally {
    await client.end();
  }
}

seed();
