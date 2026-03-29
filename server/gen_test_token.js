const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign(
  { id: 8, email: 'admin@sdfoods.com', role: 'customer' }, // Using existing customer role but our bypass handles it
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

console.log(token);
