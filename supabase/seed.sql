-- ==============================================================================
-- DATA AWAL (SEED DATA) WARUNG PRAPATAN
-- Data riil sesuai contoh pada proposal & wireframe Capstone 2
-- ==============================================================================

-- 1. Akun Pemilik Toko (Username: pemilik, Password: warung123)
INSERT INTO users (id, username, password, telegram_chat_id, created_at)
VALUES 
    ('e1a9c1e0-827b-4573-b391-7f8f9e68c5b1', 'pemilik', '$2b$10$OwVeJNlQ2nDUSrTi9gKCmeVT/gVILuKhWXfC2diI2QrpXx4uCUxzW', '123456789', NOW())
ON CONFLICT (username) DO NOTHING;

-- 2. Data Supplier Awal
INSERT INTO suppliers (id, name, created_at)
VALUES 
    (1, 'Unilever', NOW() - INTERVAL '4 days'),
    (2, 'Indofood', NOW() - INTERVAL '3 days'),
    (3, 'Roma', NOW() - INTERVAL '5 days'),
    (4, 'Indomar Co', NOW() - INTERVAL '6 days')
ON CONFLICT (name) DO NOTHING;

-- 3. Data Produk Awal
INSERT INTO products (id, name, category, unit, qty_per_karton, stock_current, created_at)
VALUES 
    (1, 'Indomie Goreng', 'Mie', 'pcs', 40, 120, NOW() - INTERVAL '10 days'),
    (2, 'Sabun Lifebuoy', 'Sabun', 'pcs', 48, 3, NOW() - INTERVAL '10 days'),
    (3, 'Royco Ayam', 'Bumbu', 'pcs', 120, 240, NOW() - INTERVAL '10 days'),
    (4, 'Teh Pucuk', 'Minuman', 'pcs', 24, 4, NOW() - INTERVAL '10 days'),
    (5, 'Gula Pasir 1kg', 'Sembako', 'pcs', 12, 1, NOW() - INTERVAL '10 days'),
    (6, 'Mie Sedaap', 'Mie', 'pcs', 40, 5, NOW() - INTERVAL '10 days'),
    (7, 'Kecap ABC', 'Bumbu', 'pcs', 24, 2, NOW() - INTERVAL '10 days'),
    (8, 'Minyak Goreng Sania 2L', 'Sembako', 'pcs', 6, 18, NOW() - INTERVAL '10 days'),
    (9, 'Kopi Kapal Api', 'Minuman', 'pcs', 20, 35, NOW() - INTERVAL '10 days'),
    (10, 'Pasta Gigi Pepsodent', 'Sabun', 'pcs', 36, 15, NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence produk & supplier bila menggunakan Postgres auto-increment
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('suppliers_id_seq', (SELECT MAX(id) FROM suppliers));

-- 4. Riwayat Transaksi Contoh (sesuai wireframe Gambar 22 & Gambar 27)
INSERT INTO transactions (product_id, user_id, supplier_id, type, qty, note, created_at)
VALUES 
    (1, 'e1a9c1e0-827b-4573-b391-7f8f9e68c5b1', 2, 'in', 80, '2 karton (Indofood)', NOW() - INTERVAL '1 day' + INTERVAL '2 hours'),
    (2, 'e1a9c1e0-827b-4573-b391-7f8f9e68c5b1', NULL, 'out', 5, 'Penjualan toko', NOW() - INTERVAL '1 day' + INTERVAL '4 hours'),
    (3, 'e1a9c1e0-827b-4573-b391-7f8f9e68c5b1', 1, 'in', 120, '1 karton (Unilever)', NOW() - INTERVAL '2 days'),
    (5, 'e1a9c1e0-827b-4573-b391-7f8f9e68c5b1', NULL, 'out', 3, 'Penjualan ecer', NOW() - INTERVAL '2 days' + INTERVAL '3 hours'),
    (2, 'e1a9c1e0-827b-4573-b391-7f8f9e68c5b1', 1, 'in', 48, '1 karton (Unilever)', NOW() - INTERVAL '3 days');
