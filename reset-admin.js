require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function resetAdmin() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'retail_ecommerce'
    });

    const newHash = await bcrypt.hash('Admin@123', 10);
    const [result] = await conn.query('UPDATE admins SET password = ? WHERE email = ?', [newHash, 'admin@retailstore.com']);
    console.log('Admin password explicitly updated to Admin@123 using native bcrypt.');
    await conn.end();
  } catch (err) {
    console.error(err);
  }
}
resetAdmin();
