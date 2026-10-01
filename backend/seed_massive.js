const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, 'backend/.env') });

const categories = [
  { id: 1, name: 'Starters', description: 'Begin your meal with these delightful bites.' },
  { id: 2, name: 'Biryani', description: 'Aromatic basmati rice cooked with authentic spices.' },
  { id: 3, name: 'Indian Main Course', description: 'Hearty curries and rich gravies.' },
  { id: 4, name: 'Chinese', description: 'Wok-tossed noodles and manchurian classics.' },
  { id: 5, name: 'Pizza', description: 'Wood-fired thin crust pizzas.' },
  { id: 6, name: 'Burgers', description: 'Juicy patties in toasted brioche buns.' },
  { id: 7, name: 'Pasta', description: 'Creamy and tangy Italian pasta.' },
  { id: 8, name: 'Breads', description: 'Fresh out of the tandoor.' },
  { id: 9, name: 'Desserts', description: 'Sweet treats to complete your meal.' },
  { id: 10, name: 'Beverages', description: 'Refreshing mocktails, sodas, and shakes.' },
];

const menuItems = [
  // Starters
  { cat: 1, name: 'Paneer Tikka', price: 249, veg: true, spice: true, prep: 15, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1599487405270-86430b0be466?q=80&w=600' },
  { cat: 1, name: 'Chicken Tikka', price: 299, veg: false, spice: true, prep: 15, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1599487405270-86430b0be466?q=80&w=600' }, // fallback
  { cat: 1, name: 'Chicken Wings', price: 349, veg: false, spice: true, prep: 20, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600' },
  { cat: 1, name: 'Gobi Manchurian', price: 199, veg: true, spice: true, prep: 15, pop: false, rec: true, img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600' },
  { cat: 1, name: 'Chilli Chicken', price: 289, veg: false, spice: true, prep: 15, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600' },
  { cat: 1, name: 'Crispy Corn', price: 189, veg: true, spice: false, prep: 10, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=600' },
  
  // Biryani
  { cat: 2, name: 'Chicken Biryani', price: 349, veg: false, spice: true, prep: 25, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600' },
  { cat: 2, name: 'Mutton Biryani', price: 449, veg: false, spice: true, prep: 30, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600' },
  { cat: 2, name: 'Veg Biryani', price: 299, veg: true, spice: false, prep: 20, pop: false, rec: true, img: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=600' },
  { cat: 2, name: 'Paneer Biryani', price: 319, veg: true, spice: false, prep: 25, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=600' },
  { cat: 2, name: 'Prawns Biryani', price: 499, veg: false, spice: true, prep: 25, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600' },
  
  // Indian Main Course
  { cat: 3, name: 'Butter Chicken', price: 389, veg: false, spice: false, prep: 20, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600' },
  { cat: 3, name: 'Paneer Butter Masala', price: 329, veg: true, spice: false, prep: 20, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600' },
  { cat: 3, name: 'Dal Makhani', price: 249, veg: true, spice: false, prep: 20, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600' },
  { cat: 3, name: 'Chicken Curry', price: 359, veg: false, spice: true, prep: 20, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600' },
  { cat: 3, name: 'Mutton Rogan Josh', price: 459, veg: false, spice: true, prep: 25, pop: false, rec: true, img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?q=80&w=600' },
  
  // Chinese
  { cat: 4, name: 'Veg Hakka Noodles', price: 219, veg: true, spice: false, prep: 15, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600' },
  { cat: 4, name: 'Chicken Hakka Noodles', price: 269, veg: false, spice: false, prep: 15, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600' },
  { cat: 4, name: 'Veg Fried Rice', price: 199, veg: true, spice: false, prep: 15, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600' },
  { cat: 4, name: 'Chicken Fried Rice', price: 259, veg: false, spice: false, prep: 15, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600' },
  
  // Pizza
  { cat: 5, name: 'Margherita Pizza', price: 299, veg: true, spice: false, prep: 25, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600' },
  { cat: 5, name: 'Chicken Pepperoni Pizza', price: 399, veg: false, spice: true, prep: 25, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600' },
  { Farmhouse: 5, name: 'Farmhouse Pizza', price: 349, veg: true, spice: false, prep: 25, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600' },
  { cat: 5, name: 'BBQ Chicken Pizza', price: 429, veg: false, spice: false, prep: 25, pop: false, rec: true, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600' },
  
  // Burgers
  { cat: 6, name: 'Crispy Veg Burger', price: 149, veg: true, spice: false, prep: 15, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=600' },
  { cat: 6, name: 'Chicken Zinger Burger', price: 199, veg: false, spice: true, prep: 15, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600' },
  { cat: 6, name: 'Double Cheese Burger', price: 249, veg: false, spice: false, prep: 20, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600' },
  { cat: 6, name: 'French Fries', price: 99, veg: true, spice: false, prep: 10, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1576107232684-1279f3908582?q=80&w=600' },
  
  // Pasta
  { cat: 7, name: 'Alfredo Pasta', price: 279, veg: true, spice: false, prep: 20, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=600' },
  { cat: 7, name: 'Arrabbiata Pasta', price: 259, veg: true, spice: true, prep: 20, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1621996311210-91501c64dfc4?q=80&w=600' },
  { cat: 7, name: 'Chicken Alfredo', price: 349, veg: false, spice: false, prep: 20, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=600' },
  
  // Breads
  { cat: 8, name: 'Butter Naan', price: 55, veg: true, spice: false, prep: 5, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600' },
  { cat: 8, name: 'Garlic Naan', price: 65, veg: true, spice: false, prep: 5, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600' },
  { cat: 8, name: 'Tandoori Roti', price: 35, veg: true, spice: false, prep: 5, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600' },
  
  // Desserts
  { cat: 9, name: 'Gulab Jamun', price: 99, veg: true, spice: false, prep: 5, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600' },
  { cat: 9, name: 'Chocolate Brownie', price: 149, veg: true, spice: false, prep: 5, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600' },
  { cat: 9, name: 'New York Cheesecake', price: 249, veg: true, spice: false, prep: 5, pop: false, rec: true, img: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=600' },
  { cat: 9, name: 'Vanilla Ice Cream', price: 79, veg: true, spice: false, prep: 2, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1570197781417-0a5f9024f2b9?q=80&w=600' },
  
  // Beverages
  { cat: 10, name: 'Cold Coffee', price: 129, veg: true, spice: false, prep: 5, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1461023058943-0708e522851a?q=80&w=600' },
  { cat: 10, name: 'Fresh Lime Soda', price: 89, veg: true, spice: false, prep: 5, pop: false, rec: false, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600' },
  { cat: 10, name: 'Mango Lassi', price: 119, veg: true, spice: false, prep: 5, pop: true, rec: false, img: 'https://images.unsplash.com/photo-1550450917-31dc8e9af467?q=80&w=600' },
  { cat: 10, name: 'Masala Chai', price: 49, veg: true, spice: false, prep: 10, pop: true, rec: true, img: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=600' }
];

const tables = [
  { table_number: 'T01', capacity: 2 },
  { table_number: 'T02', capacity: 2 },
  { table_number: 'T03', capacity: 4 },
  { table_number: 'T04', capacity: 4 },
  { table_number: 'T05', capacity: 6 },
  { table_number: 'T06', capacity: 6 },
  { table_number: 'T07', capacity: 8 },
  { table_number: 'T08', capacity: 8 },
  { table_number: 'T09', capacity: 10 },
  { table_number: 'VIP-1', capacity: 4 },
  { table_number: 'VIP-2', capacity: 6 }
];

async function seed() {
  const c = await mysql.createConnection({
    host: 'localhost', user: 'root', password: 'root', database: 'zestora'
  });
  
  // Clear old menu data to avoid conflicts
  await c.query('SET FOREIGN_KEY_CHECKS = 0');
  await c.query('TRUNCATE TABLE order_items');
  await c.query('TRUNCATE TABLE payments');
  await c.query('TRUNCATE TABLE orders');
  await c.query('TRUNCATE TABLE menu_items');
  await c.query('TRUNCATE TABLE categories');
  await c.query('TRUNCATE TABLE restaurant_tables');
  await c.query('SET FOREIGN_KEY_CHECKS = 1');

  // Categories
  for (const cat of categories) {
    await c.query('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)', [cat.id, cat.name, cat.description]);
  }
  
  // Menu Items
  for (const item of menuItems) {
    // If it has 'Farmhouse' instead of 'cat' key due to typo
    const catId = item.cat || item.Farmhouse;
    await c.query(
      `INSERT INTO menu_items 
      (category_id, name, description, price, is_veg, is_spicy, prep_time, is_available, is_popular, is_recommended, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?)`,
      [catId, item.name, `Delicious ${item.name}`, item.price, item.veg, item.spice, item.prep, item.pop, item.rec, item.img]
    );
  }
  
  // Tables
  for (const t of tables) {
    await c.query('INSERT INTO restaurant_tables (table_number, capacity, status) VALUES (?, ?, ?)', [t.table_number, t.capacity, 'AVAILABLE']);
  }
  
  console.log('Database seeded with realistic data successfully!');
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
