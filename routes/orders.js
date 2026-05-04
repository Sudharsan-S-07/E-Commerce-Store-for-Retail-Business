const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.post('/', auth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { delivery_name, delivery_phone, delivery_address, delivery_city, delivery_pincode, payment_method } = req.body;

    const [cartItems] = await connection.query(
      `SELECT c.*, p.name, p.price, p.image_url, p.stock 
       FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?`,
       [req.user.id]
    );

    if (cartItems.length === 0) throw new Error('Cart is empty');

    let totalAmount = 0;
    cartItems.forEach(item => totalAmount += (item.price * item.quantity));

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, delivery_name, delivery_phone, delivery_address, delivery_city, delivery_pincode, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, totalAmount, delivery_name, delivery_phone, delivery_address, delivery_city, delivery_pincode, payment_method]
    );
    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      if (item.stock < item.quantity) throw new Error(`Insufficient stock for ${item.name}`);
      
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, color) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.image_url, item.quantity, item.price, item.color]
      );
      
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    await connection.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    for (let order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/all', adminAuth, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email 
       FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
