const { Client } = require('pg');
require('dotenv').config();

const categories = [
  { name: 'All Products', image_url: 'https://cdn-icons-png.flaticon.com/512/3724/3724820.png' },
  { name: 'Best Sellers', image_url: 'https://cdn-icons-png.flaticon.com/512/1000/1000143.png' },
  { name: '100% Healthy', image_url: 'https://cdn-icons-png.flaticon.com/512/3429/3429302.png' },
  { name: 'Veg Pickles', image_url: 'https://cdn-icons-png.flaticon.com/512/3356/3356707.png' },
  { name: 'Non-Veg', image_url: 'https://cdn-icons-png.flaticon.com/512/3143/3143643.png' },
  { name: 'Snacks', image_url: 'https://cdn-icons-png.flaticon.com/512/2515/2515124.png' },
  { name: 'Sweets', image_url: 'https://cdn-icons-png.flaticon.com/512/2454/2454219.png' },
  { name: 'Chocolates', image_url: 'https://cdn-icons-png.flaticon.com/512/4118/4118313.png' },
  { name: 'Instant Mixes', image_url: 'https://cdn-icons-png.flaticon.com/512/3014/3014524.png' },
  { name: 'Masalas', image_url: 'https://cdn-icons-png.flaticon.com/512/3592/3592817.png' },
  { name: 'Powders', image_url: 'https://cdn-icons-png.flaticon.com/512/7513/7513511.png' },
  { name: 'Papads', image_url: 'https://cdn-icons-png.flaticon.com/512/4241/4241198.png' },
  { name: 'Oils & Ghee', image_url: 'https://cdn-icons-png.flaticon.com/512/2821/2821815.png' },
  { name: 'Millets & More', image_url: 'https://cdn-icons-png.flaticon.com/512/4836/4836882.png' },
  { name: '100% Organic', image_url: 'https://cdn-icons-png.flaticon.com/512/4488/4488344.png' },
  { name: 'Homemade Herbals', image_url: 'https://cdn-icons-png.flaticon.com/512/2969/2969966.png' },
  { name: 'Combos', image_url: 'https://cdn-icons-png.flaticon.com/512/6556/6556276.png' },
  { name: 'Seasonal', image_url: 'https://cdn-icons-png.flaticon.com/512/3068/3068565.png' },
];

async function seedCategories() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        image_url VARCHAR(255)
      )
    `);

    for (let c of categories) {
      await client.query(
        "INSERT INTO categories (name, image_url) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING",
        [c.name, c.image_url]
      );
    }
    console.log("Categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await client.end();
  }
}

seedCategories();
