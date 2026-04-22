const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

function showDb() {
    if (!fs.existsSync(DB_PATH)) {
        console.log("❌ No database.json found!");
        return;
    }

    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const db = JSON.parse(data);

        console.clear();
        console.log("==================================================");
        console.log("📊  ELECTROMINDS DATABASE STATUS");
        console.log("==================================================");
        console.log("\n📦  INVENTORY SUMMARY");
        console.log("--------------------------------------------------");
        console.log(`Total Products: ${db.inventory.length}`);

        const lowStock = db.inventory.filter(i => i.stock < 20);
        if (lowStock.length > 0) {
            console.log("\n⚠️  LOW STOCK ALERT:");
            lowStock.forEach(i => console.log(`   - ${i.name} (ID: ${i.id}): Only ${i.stock} left`));
        } else {
            console.log("✅  Stock Levels: Healthy");
        }

        console.log("\n🛒  ORDER SUMMARY");
        console.log("--------------------------------------------------");
        console.log(`Total Orders:   ${db.orders.length}`);

        const revenue = db.orders
            .filter(o => o.status !== 'Cancelled' && o.status !== 'Returned')
            .reduce((sum, o) => sum + (o.total || 0), 0);

        console.log(`Total Revenue:  $${revenue}`);

        if (db.orders.length > 0) {
            console.log("\n📜  RECENT ORDERS (Last 5):");
            const recent = db.orders.slice(-5).reverse();
            recent.forEach(o => {
                let statusIcon = "⚪";
                if (o.status === "Confirmed") statusIcon = "🟢";
                if (o.status === "Cancelled") statusIcon = "🔴";
                if (o.status === "Return Requested") statusIcon = "↩️";

                console.log(`   ${statusIcon} [${o.id}] $${o.total} (${o.status})`);
            });
        } else {
            console.log("   (No orders yet)");
        }

        console.log("\n==================================================");
        console.log(`Last Updated: ${new Date().toLocaleTimeString()}`);
        console.log("Run 'node show-db.js' to refresh.");

    } catch (error) {
        console.error("Error reading database:", error.message);
    }
}

showDb();
