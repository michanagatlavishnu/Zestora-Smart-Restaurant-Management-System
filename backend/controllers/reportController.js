const db = require('../config/db');

exports.getDashboardReport = async (req, res) => {
  const { range } = req.query; // 'today', 'week', 'month', 'year'
  
  // For simplicity, we just aggregate all completed orders
  // and format data to match frontend requirements
  
  try {
    const [orders] = await db.query(`
      SELECT total, customer_id, DATE_FORMAT(created_at, '%Y-%m-%d') as date
      FROM orders
      WHERE status = 'COMPLETED'
    `);
    
    let totalRevenue = 0;
    let totalCustomersSet = new Set();
    let salesMap = {};
    
    orders.forEach(o => {
      totalRevenue += parseFloat(o.total);
      if (o.customer_id) totalCustomersSet.add(o.customer_id);
      
      if (!salesMap[o.date]) salesMap[o.date] = 0;
      salesMap[o.date] += parseFloat(o.total);
    });
    
    const salesData = Object.keys(salesMap).sort().map(date => ({
      date,
      amount: salesMap[date]
    }));

    const [categorySales] = await db.query(`
      SELECT c.name as name, SUM(oi.quantity * oi.price) as value
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN categories c ON mi.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'COMPLETED'
      GROUP BY c.id
    `);

    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders: orders.length,
      avgOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(2) : 0,
      totalCustomers: totalCustomersSet.size,
      salesData,
      categoryData: categorySales.map(c => ({ name: c.name, value: parseFloat(c.value) }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
