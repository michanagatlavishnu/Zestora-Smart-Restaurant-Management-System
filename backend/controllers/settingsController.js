const db = require('../config/db');

exports.getSettings = async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM restaurant_settings LIMIT 1');
    if (settings.length === 0) {
      return res.json({});
    }
    res.json(settings[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  const { restaurant_name, address, phone, email, gst_percentage, service_charge_percentage, currency } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM restaurant_settings LIMIT 1');
    
    if (existing.length === 0) {
      await db.query(
        'INSERT INTO restaurant_settings (restaurant_name, address, phone, email, gst_percentage, service_charge_percentage, currency) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [restaurant_name, address, phone, email, gst_percentage, service_charge_percentage, currency]
      );
    } else {
      await db.query(
        'UPDATE restaurant_settings SET restaurant_name=?, address=?, phone=?, email=?, gst_percentage=?, service_charge_percentage=?, currency=? WHERE id=?',
        [restaurant_name, address, phone, email, gst_percentage, service_charge_percentage, currency, existing[0].id]
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
