const db = require('../config/db');

exports.createNotification = async (req, res) => {
  const { title, message, type, target_roles } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO notifications (title, message, type, target_roles) VALUES (?, ?, ?, ?)',
      [title, message, type || 'info', target_roles || null]
    );
    
    const newNotification = {
      id: result.insertId, title, message, type, target_roles, is_read: 0, created_at: new Date()
    };
    
    // Emit event
    if (req.io) {
      req.io.emit('notification', newNotification);
    }
    
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE');
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Utility function to be used internally by other controllers
exports.emitNotification = async (io, title, message, type, target_roles) => {
  try {
    const [result] = await db.query(
      'INSERT INTO notifications (title, message, type, target_roles) VALUES (?, ?, ?, ?)',
      [title, message, type || 'info', target_roles || null]
    );
    const notification = { id: result.insertId, title, message, type, target_roles, is_read: 0, created_at: new Date() };
    if (io) {
      io.emit('notification', notification);
    }
  } catch (error) {
    console.error('Error emitting notification:', error);
  }
};
