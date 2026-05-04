const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// GET all customers (admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, city, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET customer profile (self)
router.get('/profile', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, address, city, pincode FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update customer profile (self)
router.put('/profile', auth, async (req, res) => {
  const { name, phone, address, city, pincode } = req.body;
  try {
    await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ?, city = ?, pincode = ? WHERE id = ?',
      [name, phone, address, city, pincode, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
