const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [ordersResult] = await db.query('SELECT COUNT(*) as total_orders, SUM(total) as total_revenue FROM orders WHERE status = "COMPLETED"');
    const [tablesResult] = await db.query('SELECT COUNT(*) as total_tables FROM restaurant_tables');
    const [menuResult] = await db.query('SELECT COUNT(*) as total_menu_items FROM menu_items');

    res.json({
      total_orders: ordersResult[0].total_orders || 0,
      total_revenue: ordersResult[0].total_revenue || 0,
      total_tables: tablesResult[0].total_tables || 0,
      total_menu_items: menuResult[0].total_menu_items || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    const [ordersResult] = await db.query('SELECT COUNT(*) as total_orders FROM orders');
    const [tablesResult] = await db.query('SELECT COUNT(*) as total_tables FROM restaurant_tables');
    const [menuResult] = await db.query('SELECT COUNT(*) as total_menu_items FROM menu_items');
    const [catResult] = await db.query('SELECT COUNT(*) as total_categories FROM categories');

    res.json({
      total_orders: ordersResult[0].total_orders || 0,
      total_tables: tablesResult[0].total_tables || 0,
      total_menu_items: menuResult[0].total_menu_items || 0,
      total_categories: catResult[0].total_categories || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
