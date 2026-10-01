const db = require('../config/db');

exports.getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as calc_total_orders,
        (SELECT SUM(total) FROM orders WHERE customer_id = c.id AND status = 'COMPLETED') as calc_total_spending,
        (SELECT MAX(created_at) FROM orders WHERE customer_id = c.id) as last_order_date,
        (SELECT order_number FROM orders WHERE customer_id = c.id AND status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY created_at DESC LIMIT 1) as active_order_number,
        (SELECT status FROM orders WHERE customer_id = c.id AND status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY created_at DESC LIMIT 1) as active_order_status,
        (SELECT t.table_number FROM orders o2 JOIN restaurant_tables t ON o2.table_id = t.id WHERE o2.customer_id = c.id AND o2.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY o2.created_at DESC LIMIT 1) as active_table_number
      FROM customers c
      ORDER BY c.created_at DESC
    `);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as calc_total_orders,
        (SELECT SUM(total) FROM orders WHERE customer_id = c.id AND status = 'COMPLETED') as calc_total_spending
      FROM customers c
      WHERE c.id = ?
    `, [req.params.id]);

    if (customers.length === 0) return res.status(404).json({ message: 'Customer not found' });
    
    // Fetch Orders with Table Number
    const [orders] = await db.query(`
      SELECT o.*, t.table_number 
      FROM orders o
      LEFT JOIN restaurant_tables t ON o.table_id = t.id
      WHERE o.customer_id = ? 
      ORDER BY o.created_at DESC
    `, [req.params.id]);
    
    // Fetch Items for these orders
    let orderItems = [];
    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const [items] = await db.query(`
        SELECT oi.*, m.name as menu_item_name 
        FROM order_items oi
        JOIN menu_items m ON oi.menu_item_id = m.id
        WHERE oi.order_id IN (?)
      `, [orderIds]);
      orderItems = items;
    }

    // Attach items to orders
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: orderItems.filter(item => item.order_id === order.id)
    }));
    
    res.json({ ...customers[0], orderHistory: ordersWithItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  const { name, email, phone, user_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO customers (name, email, phone, user_id) VALUES (?, ?, ?, ?)',
      [name, email || null, phone, user_id || null]
    );
    res.status(201).json({ message: 'Customer created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    await db.query(
      'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email || null, phone, req.params.id]
    );
    res.json({ message: 'Customer updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
