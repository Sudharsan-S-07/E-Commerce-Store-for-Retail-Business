const express = require('express');
const router = express.Router();
const db = require('../config/db');
const adminAuth = require('../middleware/adminAuth');
router.get('/', async (req, res) => {
  const { search, category, sort, featured } = req.query;
  let query = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
  const params = [];
  if (search) { query += ` AND p.name LIKE ?`; params.push(`%${search}%`); }
  if (category) { query += ` AND c.slug = ?`; params.push(category); }
  if (featured) { query += ` AND p.is_featured = TRUE`; }
  if (sort === 'price_asc') query += ` ORDER BY p.price ASC`;
  else if (sort === 'price_desc') query += ` ORDER BY p.price DESC`;
  else query += ` ORDER BY p.created_at DESC`;
  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/', adminAuth, async (req, res) => {
  const { name, description, price, original_price, stock, image_url, category_id, is_featured } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, original_price, stock, image_url, category_id, is_featured) VALUES (?,?,?,?,?,?,?,?)',
      [name, description, price, original_price, stock, image_url, category_id, is_featured || false]
    );
    res.json({ id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/:id', adminAuth, async (req, res) => {
  const { name, description, price, original_price, stock, image_url, category_id, is_featured } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, description=?, price=?, original_price=?, stock=?, image_url=?, category_id=?, is_featured=? WHERE id=?',
      [name, description, price, original_price, stock, image_url, category_id, is_featured, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
