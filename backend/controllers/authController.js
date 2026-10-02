const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email is already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Explicitly enforce CUSTOMER role for public registration
    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)', 
      [name, email, phone || null, hashedPassword, 'CUSTOMER']
    );
    
    // Automatically log in the user after registration
    const userId = result.insertId;
    const token = jwt.sign({ id: userId, role: 'CUSTOMER' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    const user = { id: userId, name, email, phone, role: 'CUSTOMER' };
    
    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    
    const user = rows[0];
    if (user.status === 'INACTIVE') return res.status(401).json({ message: 'Account is inactive' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.user; // Set by verifyToken middleware
  const { name, email, phone, currentPassword, newPassword } = req.body;
  
  try {
    // Check if email already exists for another user
    if (email) {
       const [existing] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
       if (existing.length > 0) return res.status(400).json({ message: 'Email is already in use by another account' });
    }

    // Handle password change separately if provided
    if (currentPassword && newPassword) {
       const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [id]);
       if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
       
       const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
       if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
       
       const hashedPassword = await bcrypt.hash(newPassword, 10);
       await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    // Update profile info (name, email, phone)
    if (name || email || phone !== undefined) {
       let updates = [];
       let values = [];
       if (name) { updates.push('name = ?'); values.push(name); }
       if (email) { updates.push('email = ?'); values.push(email); }
       if (phone !== undefined) { updates.push('phone = ?'); values.push(phone || null); }
       
       if (updates.length > 0) {
         values.push(id);
         await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
       }
    }
    
    // Return updated user object
    const [updatedUser] = await db.query('SELECT id, name, email, phone, role, status FROM users WHERE id = ?', [id]);
    res.json({ message: 'Profile updated successfully', user: updatedUser[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, role, status FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
