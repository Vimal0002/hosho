// Test SQLite Connection
const { db } = require('./lib/db-sqlite');

console.log('🔍 Testing SQLite Connection...\n');

try {
    // Test inventory
    const products = db.prepare('SELECT COUNT(*) as count FROM inventory').get();
    console.log(`✅ Inventory Table: ${products.count} products`);

    // Test orders
    const orders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    console.log(`✅ Orders Table: ${orders.count} orders`);

    // Test order_items
    const items = db.prepare('SELECT COUNT(*) as count FROM order_items').get();
    console.log(`✅ Order Items Table: ${items.count} items`);

    // Show sample products
    console.log('\n📦 Sample Products:');
    const sampleProducts = db.prepare('SELECT id, name, price, stock FROM inventory LIMIT 5').all();
    sampleProducts.forEach(p => {
        console.log(`   ${p.id}: ${p.name} - $${p.price} (${p.stock} in stock)`);
    });

    console.log('\n✅ SQLite is CONNECTED and WORKING!');
    console.log('📦 Database file: electrominds.db');
    console.log('🚀 Your app is ready!\n');

} catch (error) {
    console.error('❌ Error:', error.message);
}
