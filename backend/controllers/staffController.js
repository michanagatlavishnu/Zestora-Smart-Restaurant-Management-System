const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllStaff = async (req, res) => {
  try {
    const [staff] = await db.query('SELECT id, name, email, phone, role, status, created_at FROM users WHERE role != "CUSTOMER"');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addStaff = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, role]
    );
    res.status(201).json({ message: 'Staff added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    await db.query(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, req.params.id]
    );
    res.json({ message: 'Staff updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Staff status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeRole = async (req, res) => {
  const { role } = req.body;
  try {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'Staff role updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
