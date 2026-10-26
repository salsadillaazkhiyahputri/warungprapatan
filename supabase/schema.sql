-- ==============================================================================
-- SKEMA BASIS DATA WARUNG PRAPATAN (SUPABASE / POSTGRESQL)
-- Sesuai Entity Relationship Diagram (ERD) dan Class Diagram Proposal Capstone 2
-- ==============================================================================

-- 1. Tabel users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telegram_chat_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel products
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
    qty_per_karton INT,
    stock_current INT NOT NULL DEFAULT 0,
    stock_minimum INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrasi aman untuk database yang sudah memiliki tabel products.
ALTER TABLE products ALTER COLUMN qty_per_karton DROP NOT NULL;
ALTER TABLE products ALTER COLUMN qty_per_karton DROP DEFAULT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_minimum INT NOT NULL DEFAULT 10;

-- 3. Tabel suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    supplier_id INT REFERENCES suppliers(id) ON DELETE SET NULL,
    type VARCHAR(5) NOT NULL CHECK (type IN ('in', 'out')),
    qty INT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Aturan bisnis: supplier_id wajib diisi untuk transaksi masuk ('in')
    CONSTRAINT check_supplier_on_in CHECK (
        (type = 'in' AND supplier_id IS NOT NULL) OR (type = 'out')
    )
);

-- Indeks untuk mempercepat pencarian & filtering riwayat
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);

-- Trigger otomatis untuk memperbarui stok di tabel products setiap kali transaksi dicatat
CREATE OR REPLACE FUNCTION update_product_stock_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'in' THEN
        UPDATE products 
        SET stock_current = stock_current + NEW.qty 
        WHERE id = NEW.product_id;
    ELSIF NEW.type = 'out' THEN
        UPDATE products 
        SET stock_current = GREATEST(0, stock_current - NEW.qty)
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_stock ON transactions;
CREATE TRIGGER trigger_update_stock
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_product_stock_on_transaction();
