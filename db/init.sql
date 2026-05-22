CREATE DATABASE IF NOT EXISTS furniture_store;
USE furniture_store;

-- =========================================
-- PRODUCTS
-- =========================================
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    base_price DECIMAL(12,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    thumbnail_url TEXT,
    category VARCHAR(100),
    status ENUM('ACTIVE', 'OUT_OF_STOCK') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- PRODUCT OPTIONS
-- =========================================
CREATE TABLE product_options (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    extra_price DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================
-- PRODUCT IMAGES (ONLY 1 IMAGE USED)
-- =========================================
CREATE TABLE product_images (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================
-- PRODUCT MODELS (ONLY 1 GLOBAL MODEL FILE)
-- =========================================
CREATE TABLE product_models (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    model_url TEXT NOT NULL,
    type ENUM('GLB', 'USDZ') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================
-- ORDERS
-- =========================================
CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    note TEXT,
    total_amount DECIMAL(12,2) NOT NULL,
    order_status ENUM('PENDING','CONFIRMED','SHIPPING','DELIVERED','CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- ORDER ITEMS
-- =========================================
CREATE TABLE order_items (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36),
    product_name VARCHAR(255) NOT NULL,

    width_cm DECIMAL(10,2),
    height_cm DECIMAL(10,2),
    depth_cm DECIMAL(10,2),

    option_text VARCHAR(255),
    unit_price DECIMAL(12,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =========================================
-- INVENTORY LOGS
-- =========================================
CREATE TABLE inventory_logs (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    change_amount INT NOT NULL,
    reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_product_options_product_id ON product_options(product_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_models_product_id ON product_models(product_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_inventory_logs_product_id ON inventory_logs(product_id);

-- =========================================
-- MOCK DATA
-- =========================================

-- PRODUCTS
INSERT INTO products (
    id, name, slug, description,
    base_price, stock_quantity,
    thumbnail_url, category, status
)
VALUES
('p1', 'Modern Wooden Table', 'modern-wooden-table',
 'Simple wooden table for home use',
 450.00, 10,
 '/images/image.png', 'Tables', 'ACTIVE'),

('p2', 'Comfort Sofa', 'comfort-sofa',
 'Soft and modern sofa design',
 780.00, 5,
 '/images/image.png', 'Sofas', 'ACTIVE'),

('p3', 'Office Chair Pro', 'office-chair-pro',
 'Ergonomic chair for office work',
 220.00, 0,
 '/images/image.png', 'Chairs', 'OUT_OF_STOCK');

-- OPTIONS
INSERT INTO product_options (id, product_id, name, value, extra_price)
VALUES
('po1', 'p1', 'Color', 'Natural', 0),
('po2', 'p1', 'Material', 'Wood', 0),

('po3', 'p2', 'Color', 'Gray', 0),
('po4', 'p2', 'Fabric', 'Fabric', 0),

('po5', 'p3', 'Color', 'Black', 0);

-- IMAGES (ONLY ONE IMAGE PER PRODUCT)
INSERT INTO product_images (id, product_id, image_url, sort_order)
VALUES
('pi1', 'p1', '/images/image.png', 1),
('pi2', 'p2', '/images/image.png', 1),
('pi3', 'p3', '/images/image.png', 1);

-- 3D MODEL (ONLY ONE GLOBAL FILE)
INSERT INTO product_models (id, product_id, model_url, type)
VALUES
('pm1', 'p1', '/model3d/model.glb', 'GLB'),
('pm2', 'p2', '/model3d/model.glb', 'GLB'),
('pm3', 'p3', '/model3d/model.glb', 'GLB');

-- ORDERS
INSERT INTO orders (
    id, customer_name, phone, email,
    address, note, total_amount, order_status
)
VALUES
('o1', 'Nguyen Van A', '0901234567', 'a@gmail.com',
 'Hanoi, Vietnam', 'Call before delivery',
 1230.00, 'PENDING');

-- ORDER ITEMS
INSERT INTO order_items (
    id, order_id, product_id, product_name,
    width_cm, height_cm, depth_cm,
    option_text, unit_price, quantity, subtotal
)
VALUES
('oi1', 'o1', 'p1', 'Modern Wooden Table',
 160, 75, 80,
 'Color: Natural, Material: Wood',
 450.00, 1, 450.00),

('oi2', 'o1', 'p2', 'Comfort Sofa',
 NULL, NULL, NULL,
 'Color: Gray, Fabric: Fabric',
 780.00, 1, 780.00);

-- INVENTORY LOGS
INSERT INTO inventory_logs (id, product_id, change_amount, reason)
VALUES
('il1', 'p1', -1, 'Order o1'),
('il2', 'p2', -1, 'Order o1'),
('il3', 'p3', 20, 'Restock');