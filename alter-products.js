require('dotenv').config();
const mysql = require('mysql2/promise');

async function structureDb() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'retail_ecommerce'
    });

    console.log('Altering products table...');
    
    // Attempting to add columns cleanly. Surrounding with try/catch in case they already exist from previous runs.
    try { await conn.query('ALTER TABLE products ADD COLUMN features JSON'); } catch(e) {}
    try { await conn.query('ALTER TABLE products ADD COLUMN size_fit TEXT'); } catch(e) {}
    try { await conn.query('ALTER TABLE products ADD COLUMN materials TEXT'); } catch(e) {}
    try { await conn.query('ALTER TABLE products ADD COLUMN sku VARCHAR(50)'); } catch(e) {}

    console.log('Database schema expansion complete!');
    await conn.end();
  } catch (e) {
    console.error('Migration error:', e);
  }
}
structureDb();
