-- Insert default settings
INSERT INTO restaurant_settings (restaurant_name, address, phone, email, gst_percentage, service_charge_percentage, currency)
VALUES ('ZESTORA', '123 Tech Park, Silicon Valley, CA 94025', '+1 (555) 123-4567', 'contact@zestora.com', 5.00, 10.00, 'USD')
ON DUPLICATE KEY UPDATE restaurant_name='ZESTORA';

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
(1, 'Paneer Tikka', 'Grilled cottage cheese cubes', 12.00, TRUE, TRUE, 15),
(1, 'Chicken Wings', 'Spicy and tangy wings', 14.50, FALSE, TRUE, 20),
(2, 'Butter Chicken', 'Creamy tomato gravy with chicken', 18.00, FALSE, FALSE, 25),
(2, 'Palak Paneer', 'Spinach curry with cottage cheese', 16.00, TRUE, FALSE, 20),
(3, 'Chicken Biryani', 'Fragrant rice with marinated chicken', 22.00, FALSE, TRUE, 30),
(4, 'Gulab Jamun', 'Sweet milk dumplings', 6.00, TRUE, FALSE, 5),
(5, 'Mojito', 'Mint and lime cooler', 5.00, TRUE, FALSE, 5);
