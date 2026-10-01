const db = require('../config/db');

exports.getAllPayments = async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT p.*, o.order_number, c.name as customer_name 
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT p.*, o.order_number, c.name as customer_name 
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (payments.length === 0) return res.status(404).json({ message: 'Payment not found' });
    res.json(payments[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
