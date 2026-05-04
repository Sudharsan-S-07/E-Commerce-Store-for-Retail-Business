require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'retail_ecommerce'
    });

    console.log('Altering constraints and tables...');
    // Drop the unique constraint first if it gets in the way of adding duplicate products with different colors
    // Actually, unique_cart_item (user_id, product_id) prevents adding multiple colors of the SAME product!
    // We MUST drop unique_cart_item constraint.
    try { await conn.query('ALTER TABLE cart DROP INDEX unique_cart_item'); } catch(e) {}
    
    // Add color column to cart
    try { await conn.query('ALTER TABLE cart ADD COLUMN color VARCHAR(50) DEFAULT "Obsidian"'); } catch(e) {}
    
    // Add color column to order_items
    try { await conn.query('ALTER TABLE order_items ADD COLUMN color VARCHAR(50) DEFAULT "Obsidian"'); } catch(e) {}

    // Add new unique index incorporating color
    try { await conn.query('ALTER TABLE cart ADD CONSTRAINT unique_cart_item UNIQUE (user_id, product_id, color)'); } catch(e) {}

    console.log('Database schema successfully updated to support color variations!');
    await conn.end();
  } catch (e) {
    console.error('Migration error:', e);
  }
}
migrate();
