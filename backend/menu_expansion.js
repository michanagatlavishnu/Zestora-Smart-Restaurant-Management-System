const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zestora_db',
  port: Number(process.env.DB_PORT || 3306),
};

if (process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com'))) {
  dbConfig.ssl = { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' };
  if (process.env.DB_SSL_CA) dbConfig.ssl.ca = process.env.DB_SSL_CA;
}

const menuItems = [
  // STARTERS (Cat 1)
  { category_id: 1, name: 'French Fries', description: 'Crispy golden potato fries', price: 149.00, is_veg: true, is_spicy: false, prep_time: 10 },
  { category_id: 1, name: 'Crispy Corn', description: 'Fried corn kernels tossed in salt and pepper', price: 179.00, is_veg: true, is_spicy: false, prep_time: 10 },
  { category_id: 1, name: 'Gobi Manchurian', description: 'Crispy cauliflower tossed in Indo-Chinese sauce', price: 199.00, is_veg: true, is_spicy: true, prep_time: 15 },
  { category_id: 1, name: 'Mushroom Manchurian', description: 'Crispy mushrooms tossed in tangy sauce', price: 229.00, is_veg: true, is_spicy: true, prep_time: 15 },
  { category_id: 1, name: 'Paneer Tikka', description: 'Grilled cottage cheese cubes', price: 249.00, is_veg: true, is_spicy: true, prep_time: 15 },
  { category_id: 1, name: 'Chilli Chicken', description: 'Spicy, sweet, and tangy chicken', price: 279.00, is_veg: false, is_spicy: true, prep_time: 20 },
  { category_id: 1, name: 'Chicken Wings', description: 'Spicy and tangy wings', price: 299.00, is_veg: false, is_spicy: true, prep_time: 20 },
  
  // MAIN COURSE (Cat 2)
  { category_id: 2, name: 'Dal Makhani', description: 'Rich and creamy slow-cooked lentils', price: 249.00, is_veg: true, is_spicy: false, prep_time: 20 },
  { category_id: 2, name: 'Chicken Curry', description: 'Traditional homestyle chicken curry', price: 299.00, is_veg: false, is_spicy: true, prep_time: 25 },
  { category_id: 2, name: 'Palak Paneer', description: 'Cottage cheese in creamy spinach gravy', price: 299.00, is_veg: true, is_spicy: false, prep_time: 20 },
  { category_id: 2, name: 'Paneer Butter Masala', description: 'Cottage cheese in a rich tomato gravy', price: 329.00, is_veg: true, is_spicy: false, prep_time: 20 },
  { category_id: 2, name: 'Kadai Chicken', description: 'Chicken cooked with bell peppers and spices', price: 349.00, is_veg: false, is_spicy: true, prep_time: 25 },
  { category_id: 2, name: 'Butter Chicken', description: 'Classic creamy tomato chicken curry', price: 399.00, is_veg: false, is_spicy: false, prep_time: 25 },
  { category_id: 2, name: 'Mutton Rogan Josh', description: 'Classic aromatic lamb curry', price: 449.00, is_veg: false, is_spicy: true, prep_time: 30 },
  { category_id: 2, name: 'Tandoori Roti', description: 'Traditional whole wheat flatbread', price: 29.00, is_veg: true, is_spicy: false, prep_time: 5 },
  { category_id: 2, name: 'Butter Naan', description: 'Soft flatbread glazed with butter', price: 59.00, is_veg: true, is_spicy: false, prep_time: 10 },
  { category_id: 2, name: 'Garlic Naan', description: 'Soft flatbread topped with minced garlic', price: 69.00, is_veg: true, is_spicy: false, prep_time: 10 },

  // BIRYANI (Cat 3)
  { category_id: 3, name: 'Veg Biryani', description: 'Aromatic basmati rice with mixed vegetables', price: 249.00, is_veg: true, is_spicy: true, prep_time: 25 },
  { category_id: 3, name: 'Egg Biryani', description: 'Aromatic basmati rice with boiled eggs', price: 279.00, is_veg: false, is_spicy: true, prep_time: 25 },
  { category_id: 3, name: 'Paneer Biryani', description: 'Aromatic basmati rice with spiced paneer cubes', price: 299.00, is_veg: true, is_spicy: true, prep_time: 25 },
  { category_id: 3, name: 'Chicken Biryani', description: 'Classic spiced rice with tender chicken', price: 349.00, is_veg: false, is_spicy: true, prep_time: 30 },
  { category_id: 3, name: 'Prawns Biryani', description: 'Aromatic basmati rice with spiced prawns', price: 449.00, is_veg: false, is_spicy: true, prep_time: 30 },
  { category_id: 3, name: 'Mutton Biryani', description: 'Classic spiced rice with tender lamb', price: 499.00, is_veg: false, is_spicy: true, prep_time: 30 },

  // DESSERTS (Cat 4)
  { category_id: 4, name: 'Vanilla Ice Cream', description: 'Classic creamy vanilla ice cream', price: 99.00, is_veg: true, is_spicy: false, prep_time: 5 },
  { category_id: 4, name: 'Gulab Jamun', description: 'Deep-fried milk dumplings in sugar syrup', price: 99.00, is_veg: true, is_spicy: false, prep_time: 5 },
  { category_id: 4, name: 'Chocolate Brownie', description: 'Warm fudgy chocolate brownie', price: 149.00, is_veg: true, is_spicy: false, prep_time: 10 },
  { category_id: 4, name: 'New York Cheesecake', description: 'Classic baked cream cheese dessert', price: 249.00, is_veg: false, is_spicy: false, prep_time: 5 },

  // BEVERAGES (Cat 5)
  { category_id: 5, name: 'Masala Chai', description: 'Indian spiced milk tea', price: 79.00, is_veg: true, is_spicy: false, prep_time: 10 },
  { category_id: 5, name: 'Fresh Lime Soda', description: 'Refreshing sweet and salt lime drink', price: 99.00, is_veg: true, is_spicy: false, prep_time: 5 },
  { category_id: 5, name: 'Mango Lassi', description: 'Sweet mango yogurt drink', price: 129.00, is_veg: true, is_spicy: false, prep_time: 5 },
  { category_id: 5, name: 'Mojito', description: 'Refreshing mint and lime mocktail', price: 149.00, is_veg: true, is_spicy: false, prep_time: 5 },
  { category_id: 5, name: 'Cold Coffee', description: 'Chilled sweet coffee blend', price: 149.00, is_veg: true, is_spicy: false, prep_time: 5 },
];

async function seed() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    let inserted = 0;
    let updated = 0;

    for (const item of menuItems) {
      const [rows] = await connection.query('SELECT id FROM menu_items WHERE name = ?', [item.name]);
      if (rows.length > 0) {
        // Update ONLY intended fields, never delete, never duplicate
        await connection.query(
          'UPDATE menu_items SET category_id=?, description=?, price=?, is_veg=?, is_spicy=?, prep_time=?, is_available=1 WHERE id=?',
          [item.category_id, item.description, item.price, item.is_veg, item.is_spicy, item.prep_time, rows[0].id]
        );
        updated++;
      } else {
        // Insert missing items
        await connection.query(
          'INSERT INTO menu_items (category_id, name, description, price, is_veg, is_spicy, prep_time, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
          [item.category_id, item.name, item.description, item.price, item.is_veg, item.is_spicy, item.prep_time]
        );
        inserted++;
      }
    }
    console.log(`Successfully synced 32 menu items. Inserted: ${inserted}, Updated: ${updated}`);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    if (connection) await connection.end();
  }
}

seed();
