const db = require('../config/db');

exports.getTables = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM restaurant_tables');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addTable = async (req, res) => {
  const { table_number, capacity } = req.body;
  try {
    const [result] = await db.query('INSERT INTO restaurant_tables (table_number, capacity) VALUES (?, ?)', [table_number, capacity]);
    res.status(201).json({ id: result.insertId, table_number, capacity, status: 'AVAILABLE' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTableStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE restaurant_tables SET status = ? WHERE id = ?', [status, id]);
    req.io.emit('table_status_update', { tableId: id, status });
    res.json({ message: 'Table status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

