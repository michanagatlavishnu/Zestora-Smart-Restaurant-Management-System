const db = require('../config/db');

exports.createOrder = async (req, res) => {
  const { table_id, customer_name, customer_phone, customer_email, items } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Check or create customer
    let customer_id = null;
    
    if (req.user && req.user.role === 'CUSTOMER') {
      const [existing] = await connection.query('SELECT id FROM customers WHERE user_id = ?', [req.user.id]);
      if (existing.length > 0) {
        customer_id = existing[0].id;
      } else {
        const [u] = await connection.query('SELECT name, email, phone FROM users WHERE id = ?', [req.user.id]);
        if (u.length > 0) {
          const userObj = u[0];
          const [orphan] = await connection.query('SELECT id FROM customers WHERE (phone = ? OR email = ?) AND user_id IS NULL', [userObj.phone || customer_phone || null, userObj.email || customer_email || null]);
          
          if (orphan.length > 0) {
            customer_id = orphan[0].id;
            await connection.query('UPDATE customers SET user_id = ? WHERE id = ?', [req.user.id, customer_id]);
          } else {
            const [newCust] = await connection.query(
              'INSERT INTO customers (user_id, name, phone, email) VALUES (?, ?, ?, ?)', 
              [req.user.id, userObj.name || customer_name, userObj.phone || customer_phone || null, userObj.email || customer_email || null]
            );
            customer_id = newCust.insertId;
          }
        }
      }
    } else if (customer_phone || customer_email) {
      const [existing] = await connection.query(
        'SELECT id FROM customers WHERE phone = ? OR (email = ? AND email IS NOT NULL)', 
        [customer_phone || null, customer_email || null]
      );
      if (existing.length > 0) {
        customer_id = existing[0].id;
      } else if (customer_name) {
        const [newCust] = await connection.query(
          'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)', 
          [customer_name, customer_phone || null, customer_email || null]
        );
        customer_id = newCust.insertId;
        req.io?.emit('customer_created', { id: customer_id, name: customer_name });
      }
    }

    let subtotal = 0;
    const finalItems = [];

    // Fetch prices securely from DB
    for (const item of items) {
      const [menuItem] = await connection.query('SELECT price FROM menu_items WHERE id = ?', [item.menu_item_id]);
      if (menuItem.length === 0) throw new Error(`Invalid menu item ${item.menu_item_id}`);
      const price = parseFloat(menuItem[0].price);
      subtotal += item.quantity * price;
      finalItems.push([null, item.menu_item_id, item.quantity, price, item.special_instructions || '']);
    }

    const tax = subtotal * 0.05;
    const service_charge = subtotal * 0.10;
    const total = subtotal + tax + service_charge;

    // Generate Order Number
    const order_number = 'ORD-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const [orderResult] = await connection.query(
      'INSERT INTO orders (order_number, table_id, customer_id, subtotal, tax, service_charge, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [order_number, table_id || null, customer_id, subtotal, tax, service_charge, total, 'NEW']
    );
    const orderId = orderResult.insertId;

    // Set orderId in finalItems array
    finalItems.forEach(i => i[0] = orderId);

    await connection.query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions) VALUES ?',
      [finalItems]
    );
    
    if (table_id) {
        await connection.query('UPDATE restaurant_tables SET status = ? WHERE id = ?', ['OCCUPIED', table_id]);
        req.io?.emit('table_status_update', { tableId: table_id, status: 'OCCUPIED' });
    }

    await connection.commit();
    req.io?.emit('new_order', { orderId, table_id, total, status: 'NEW' });
    res.status(201).json({ message: 'Order created', orderId, order_number });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM orders o 
      LEFT JOIN customers c ON o.customer_id = c.id 
      ORDER BY o.created_at DESC
    `);
    
    const [items] = await db.query(`
      SELECT oi.*, m.name 
      FROM order_items oi 
      JOIN menu_items m ON oi.menu_item_id = m.id
    `);

    const ordersWithItems = orders.map(order => ({
      ...order,
      items: items.filter(item => item.order_id === order.id)
    }));

    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    req.io?.emit('order_status_update', { orderId: id, status });
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPayment = async (req, res) => {
  const { order_id, payment_method, amount } = req.body; 
  const actualOrderId = req.params.id || order_id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    await connection.query(
      'INSERT INTO payments (order_id, payment_method, amount, status) VALUES (?, ?, ?, ?)',
      [actualOrderId, payment_method, amount, 'PAID']
    );
    
    await connection.query('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?', ['COMPLETED', 'PAID', actualOrderId]);
    
    const [orderInfo] = await connection.query('SELECT table_id, customer_id, total FROM orders WHERE id = ?', [actualOrderId]);
    
    if (orderInfo.length > 0) {
      const orderData = orderInfo[0];
      
      if (orderData.table_id) {
        await connection.query('UPDATE restaurant_tables SET status = ? WHERE id = ?', ['AVAILABLE', orderData.table_id]);
        req.io?.emit('table_status_update', { tableId: orderData.table_id, status: 'AVAILABLE' });
      }

      if (orderData.customer_id) {
        await connection.query('UPDATE customers SET total_orders = total_orders + 1, total_spending = total_spending + ? WHERE id = ?', [orderData.total, orderData.customer_id]);
      }
    }

    await connection.commit();
    req.io?.emit('order_status_update', { orderId: actualOrderId, status: 'COMPLETED' });
    res.status(201).json({ message: 'Payment successful' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
