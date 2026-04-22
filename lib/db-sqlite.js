const Database = require('better-sqlite3');
const path = require('path');

// Create SQLite database file
const dbPath = path.join(process.cwd(), 'electrominds.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log(`📦 SQLite database: ${dbPath}`);

// Create tables
function createTables() {
    try {
        // Create inventory table
        db.exec(`
            CREATE TABLE IF NOT EXISTS inventory (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                category TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create orders table
        db.exec(`
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                customer_name TEXT NOT NULL,
                email TEXT NOT NULL,
                total REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'Pending',
                payment_method TEXT,
                shipping_address TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create order_items table
        db.exec(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        // Create returns table
        db.exec(`
            CREATE TABLE IF NOT EXISTS returns (
                id TEXT PRIMARY KEY,
                order_id TEXT NOT NULL,
                reason TEXT,
                status TEXT DEFAULT 'Pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id)
            )
        `);

        // Create feedback table
        db.exec(`
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_email TEXT,
                message TEXT,
                rating INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create indexes
        db.exec(`CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category)`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email)`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`);

        console.log('✅ SQLite tables created successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
        return false;
    }
}

// Initialize database with data from JSON
function initializeFromJSON() {
    try {
        // Check if inventory is empty
        const count = db.prepare('SELECT COUNT(*) as count FROM inventory').get();

        if (count.count === 0) {
            console.log('📦 Migrating data from database.json to SQLite...');

            const fs = require('fs');
            const jsonPath = path.join(process.cwd(), 'database.json');

            if (fs.existsSync(jsonPath)) {
                const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

                // Insert inventory
                if (data.inventory && data.inventory.length > 0) {
                    const insertInventory = db.prepare(
                        'INSERT INTO inventory (id, name, price, stock, category) VALUES (?, ?, ?, ?, ?)'
                    );

                    const insertMany = db.transaction((items) => {
                        for (const item of items) {
                            insertInventory.run(item.id, item.name, item.price, item.stock, item.category);
                        }
                    });

                    insertMany(data.inventory);
                    console.log(`✅ Migrated ${data.inventory.length} products to SQLite`);
                }

                // Insert orders
                if (data.orders && data.orders.length > 0) {
                    const insertOrder = db.prepare(
                        `INSERT INTO orders (id, customer_name, email, total, status, payment_method, shipping_address, created_at) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                    );

                    const insertOrderItem = db.prepare(
                        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
                    );

                    const insertOrderWithItems = db.transaction((order) => {
                        const createdAt = order.date ? new Date(order.date).toISOString() : new Date().toISOString();

                        insertOrder.run(
                            order.id,
                            order.customerName || 'Guest User',
                            order.email || 'guest@electrominds.com',
                            order.total,
                            order.status || 'Confirmed',
                            order.paymentMethod || 'N/A',
                            order.address || order.shippingAddress || '',
                            createdAt
                        );

                        if (order.items && order.items.length > 0) {
                            for (const item of order.items) {
                                const product = db.prepare('SELECT price FROM inventory WHERE id = ?').get(item.id);
                                insertOrderItem.run(order.id, item.id, item.quantity, product?.price || 0);
                            }
                        }
                    });

                    for (const order of data.orders) {
                        insertOrderWithItems(order);
                    }

                    console.log(`✅ Migrated ${data.orders.length} orders to SQLite`);
                }
            }
        } else {
            console.log('✅ Database already has data, skipping migration');
        }

        return true;
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        return false;
    }
}

module.exports = {
    db,
    createTables,
    initializeFromJSON
};
