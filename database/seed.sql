-- Insert default settings
INSERT INTO restaurant_settings (restaurant_name, address, phone, email, gst_percentage, service_charge_percentage, currency)
VALUES ('ZESTORA', '123 Tech Park, Silicon Valley, CA 94025', '+1 (555) 123-4567', 'contact@zestora.com', 5.00, 10.00, 'INR')
ON DUPLICATE KEY UPDATE restaurant_name='ZESTORA', currency='INR';

-- Passwords are 'password123' hashed with bcrypt
-- Generated using standard bcrypt ($2a$10$xyz...) for 'password123'
-- Hash: $2a$10$u24a4t3Ff8z6X4BfM.l9L.XkS0Qn6/qP6uX5eJ4qK3Y3W8y4sC4G2
INSERT INTO users (name, email, phone, password, role) VALUES
('Admin User', 'admin@zestora.com', '1000000001', '$2a$10$u24a4t3Ff8z6X4BfM.l9L.XkS0Qn6/qP6uX5eJ4qK3Y3W8y4sC4G2', 'ADMIN'),
('Manager Mike', 'manager@zestora.com', '1000000002', '$2a$10$u24a4t3Ff8z6X4BfM.l9L.XkS0Qn6/qP6uX5eJ4qK3Y3W8y4sC4G2', 'MANAGER'),
('Cashier Carol', 'cashier@zestora.com', '1000000003', '$2a$10$u24a4t3Ff8z6X4BfM.l9L.XkS0Qn6/qP6uX5eJ4qK3Y3W8y4sC4G2', 'CASHIER'),
('Waiter Wayne', 'waiter@zestora.com', '1000000004', '$2a$10$u24a4t3Ff8z6X4BfM.l9L.XkS0Qn6/qP6uX5eJ4qK3Y3W8y4sC4G2', 'WAITER'),
('Kitchen Kevin', 'kitchen@zestora.com', '1000000005', '$2a$10$u24a4t3Ff8z6X4BfM.l9L.XkS0Qn6/qP6uX5eJ4qK3Y3W8y4sC4G2', 'KITCHEN');

-- Insert Demo Customers
INSERT INTO customers (name, email, phone) VALUES
('John Doe', 'john@example.com', '2000000001'),
('Jane Smith', 'jane@example.com', '2000000002');

-- Insert Tables
INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
('T-01', 2, 'AVAILABLE'),
('T-02', 2, 'AVAILABLE'),
('T-03', 4, 'AVAILABLE'),
('T-04', 4, 'AVAILABLE'),
('T-05', 6, 'AVAILABLE'),
('T-06', 8, 'AVAILABLE');

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Starters', 'Appetizers to begin your meal'),
('Main Course', 'Hearty and fulfilling dishes'),
('Biryani', 'Aromatic rice dishes'),
('Desserts', 'Sweet treats'),
('Beverages', 'Refreshing drinks');

-- Insert Menu Items
INSERT INTO menu_items (category_id, name, description, price, is_veg, is_spicy, prep_time) VALUES
  (1, 'French Fries', 'Crispy golden potato fries', 149.00, TRUE, FALSE, 10),
  (1, 'Crispy Corn', 'Fried corn kernels tossed in salt and pepper', 179.00, TRUE, FALSE, 10),
  (1, 'Gobi Manchurian', 'Crispy cauliflower tossed in Indo-Chinese sauce', 199.00, TRUE, TRUE, 15),
  (1, 'Mushroom Manchurian', 'Crispy mushrooms tossed in tangy sauce', 229.00, TRUE, TRUE, 15),
  (1, 'Paneer Tikka', 'Grilled cottage cheese cubes', 249.00, TRUE, TRUE, 15),
  (1, 'Chilli Chicken', 'Spicy, sweet, and tangy chicken', 279.00, FALSE, TRUE, 20),
  (1, 'Chicken Wings', 'Spicy and tangy wings', 299.00, FALSE, TRUE, 20),
  (2, 'Tandoori Roti', 'Traditional whole wheat flatbread', 29.00, TRUE, FALSE, 5),
  (2, 'Butter Naan', 'Soft flatbread glazed with butter', 59.00, TRUE, FALSE, 10),
  (2, 'Garlic Naan', 'Soft flatbread topped with minced garlic', 69.00, TRUE, FALSE, 10),
  (2, 'Dal Makhani', 'Rich and creamy slow-cooked lentils', 249.00, TRUE, FALSE, 20),
  (2, 'Chicken Curry', 'Traditional homestyle chicken curry', 299.00, FALSE, TRUE, 25),
  (2, 'Palak Paneer', 'Cottage cheese in creamy spinach gravy', 299.00, TRUE, FALSE, 20),
  (2, 'Paneer Butter Masala', 'Cottage cheese in a rich tomato gravy', 329.00, TRUE, FALSE, 20),
  (2, 'Kadai Chicken', 'Chicken cooked with bell peppers and spices', 349.00, FALSE, TRUE, 25),
  (2, 'Butter Chicken', 'Classic creamy tomato chicken curry', 399.00, FALSE, FALSE, 25),
  (2, 'Mutton Rogan Josh', 'Classic aromatic lamb curry', 449.00, FALSE, TRUE, 30),
  (3, 'Veg Biryani', 'Aromatic basmati rice with mixed vegetables', 249.00, TRUE, TRUE, 25),
  (3, 'Egg Biryani', 'Aromatic basmati rice with boiled eggs', 279.00, FALSE, TRUE, 25),
  (3, 'Paneer Biryani', 'Aromatic basmati rice with spiced paneer cubes', 299.00, TRUE, TRUE, 25),
  (3, 'Chicken Biryani', 'Classic spiced rice with tender chicken', 349.00, FALSE, TRUE, 30),
  (3, 'Prawns Biryani', 'Aromatic basmati rice with spiced prawns', 449.00, FALSE, TRUE, 30),
  (3, 'Mutton Biryani', 'Classic spiced rice with tender lamb', 499.00, FALSE, TRUE, 30),
  (4, 'Vanilla Ice Cream', 'Classic creamy vanilla ice cream', 99.00, TRUE, FALSE, 5),
  (4, 'Gulab Jamun', 'Deep-fried milk dumplings in sugar syrup', 99.00, TRUE, FALSE, 5),
  (4, 'Chocolate Brownie', 'Warm fudgy chocolate brownie', 149.00, TRUE, FALSE, 10),
  (4, 'New York Cheesecake', 'Classic baked cream cheese dessert', 249.00, FALSE, FALSE, 5),
  (5, 'Masala Chai', 'Indian spiced milk tea', 79.00, TRUE, FALSE, 10),
  (5, 'Fresh Lime Soda', 'Refreshing sweet and salt lime drink', 99.00, TRUE, FALSE, 5),
  (5, 'Mango Lassi', 'Sweet mango yogurt drink', 129.00, TRUE, FALSE, 5),
  (5, 'Mojito', 'Refreshing mint and lime mocktail', 149.00, TRUE, FALSE, 5),
  (5, 'Cold Coffee', 'Chilled sweet coffee blend', 149.00, TRUE, FALSE, 5);
