const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
router.get('/', auth, async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT c.*, p.name, p.price, p.image_url 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, quantity = 1, color = 'Obsidian' } = req.body;
    const [existing] = await pool.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND color = ?', 
      [req.user.id, product_id, color]
    );
    if (existing.length > 0) {
      await pool.query('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
    } else {
      await pool.query('INSERT INTO cart (user_id, product_id, quantity, color) VALUES (?, ?, ?, ?)', [req.user.id, product_id, quantity, color]);
    }
    res.status(201).json({ message: 'Added to cart successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/:id', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
    res.json({ message: 'Cart updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Item removed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;
