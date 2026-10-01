const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ id: result.insertId, name, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMenuItem = async (req, res) => {
  const { category_id, name, description, price, image_url, is_veg, is_spicy, prep_time, is_available, is_popular, is_recommended } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO menu_items 
      (category_id, name, description, price, image_url, is_veg, is_spicy, prep_time, is_available, is_popular, is_recommended) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id, name, description, price, image_url || null, 
        is_veg !== undefined ? is_veg : true, 
        is_spicy !== undefined ? is_spicy : false, 
        prep_time || 15, 
        is_available !== undefined ? is_available : true,
        is_popular !== undefined ? is_popular : false,
        is_recommended !== undefined ? is_recommended : false
      ]
    );
    res.status(201).json({ id: result.insertId, category_id, name, description, price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, description, price, image_url, is_veg, is_spicy, prep_time, is_available, is_popular, is_recommended } = req.body;
  try {
    await db.query(
      `UPDATE menu_items 
       SET category_id = COALESCE(?, category_id), 
           name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           price = COALESCE(?, price), 
           image_url = COALESCE(?, image_url), 
           is_veg = COALESCE(?, is_veg), 
           is_spicy = COALESCE(?, is_spicy), 
           prep_time = COALESCE(?, prep_time), 
           is_available = COALESCE(?, is_available),
           is_popular = COALESCE(?, is_popular),
           is_recommended = COALESCE(?, is_recommended)
       WHERE id = ?`, 
      [category_id, name, description, price, image_url, is_veg, is_spicy, prep_time, is_available, is_popular, is_recommended, id]
    );
    res.json({ message: 'Menu item updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM menu_items WHERE id = ?', [id]);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
