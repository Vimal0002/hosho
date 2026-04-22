const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatbot.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database');
});

const initializeDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cart table
    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      )
    `);

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Order items table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      )
    `);

    // Conversations table for chat history
    db.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Sample products
    db.run(`
      INSERT OR IGNORE INTO products (name, description, category, price, stock, image_url)
      VALUES 
        ('Wireless Headphones', 'High-quality Bluetooth headphones with noise cancellation', 'Audio', 89.99, 50, 'https://via.placeholder.com/300?text=Headphones'),
        ('USB-C Cable', 'Fast charging USB-C cable 6ft', 'Accessories', 12.99, 200, 'https://via.placeholder.com/300?text=USB-C'),
        ('4K Webcam', '4K Ultra HD webcam for streaming and video calls', 'Video', 149.99, 30, 'https://via.placeholder.com/300?text=Webcam'),
        ('Mechanical Keyboard', 'RGB backlit mechanical keyboard with custom switches', 'Peripherals', 129.99, 40, 'https://via.placeholder.com/300?text=Keyboard'),
        ('Portable SSD', '1TB portable solid state drive with fast transfer', 'Storage', 99.99, 60, 'https://via.placeholder.com/300?text=SSD'),
        ('Phone Stand', 'Adjustable aluminum phone stand', 'Accessories', 19.99, 100, 'https://via.placeholder.com/300?text=Stand'),
        ('LED Monitor Light', 'USB powered monitor light to reduce eye strain', 'Lighting', 39.99, 80, 'https://via.placeholder.com/300?text=Light'),
        ('Laptop Cooling Pad', 'Laptop cooling pad with adjustable speed', 'Cooling', 34.99, 70, 'https://via.placeholder.com/300?text=Cooling')
    `);

    console.log('Database initialized successfully');
  });
};

module.exports = {
  db,
  initializeDatabase
};
