const express = require('express');
const router = express.Router();
const db = require('../config/db');
const adminAuth = require('../middleware/adminAuth');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add category (admin)
router.post('/', adminAuth, async (req, res) => {
  const { name, slug } = req.body;
  try {
    await db.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
    res.json({ message: 'Category added' });
  } catch (err) {
    res.status(500).json({ error: 'Server error or duplicate slug' });
  }
});

// PUT update category (admin)
router.put('/:id', adminAuth, async (req, res) => {
  const { name, slug } = req.body;
  try {
    await db.query('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, req.params.id]);
    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE remove category (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
