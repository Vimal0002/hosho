
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'database.json');

const INITIAL_DATA = {
    inventory: [
        // ========== TELEVISIONS ==========
        { id: 'TV001', name: 'Sony Bravia 55" 4K TV', price: 600, stock: 50, category: 'Televisions' },
        { id: 'TV002', name: 'Samsung 65" QLED TV', price: 900, stock: 60, category: 'Televisions' },
        { id: 'TV003', name: 'LG OLED 55" TV', price: 1200, stock: 45, category: 'Televisions' },
        { id: 'TV004', name: 'TCL 43" Smart TV', price: 350, stock: 80, category: 'Televisions' },
        { id: 'TV005', name: 'Hisense 50" 4K TV', price: 450, stock: 70, category: 'Televisions' },

        // ========== HOME APPLIANCES ==========
        { id: 'FR001', name: 'LG 260L Frost Free Fridge', price: 350, stock: 75, category: 'Home Appliances' },
        { id: 'FR002', name: 'Samsung Double Door Fridge', price: 800, stock: 80, category: 'Home Appliances' },
        { id: 'FR003', name: 'Whirlpool 200L Single Door Fridge', price: 250, stock: 90, category: 'Home Appliances' },
        { id: 'MW001', name: 'Whirlpool Microwave 20L', price: 100, stock: 100, category: 'Home Appliances' },
        { id: 'MW002', name: 'Samsung Convection Microwave 28L', price: 180, stock: 85, category: 'Home Appliances' },
        { id: 'WM001', name: 'Bosch Front Load Washer', price: 450, stock: 65, category: 'Home Appliances' },
        { id: 'WM002', name: 'LG Top Load Washer 7kg', price: 320, stock: 70, category: 'Home Appliances' },
        { id: 'AC001', name: 'Daikin 1.5 Ton AC', price: 550, stock: 60, category: 'Home Appliances' },
        { id: 'AC002', name: 'Voltas Split AC 1 Ton', price: 400, stock: 75, category: 'Home Appliances' },

        // ========== MOBILE PHONES ==========
        { id: 'PH001', name: 'iPhone 15', price: 999, stock: 150, category: 'Mobile Phones' },
        { id: 'PH002', name: 'Samsung Galaxy S24', price: 950, stock: 120, category: 'Mobile Phones' },
        { id: 'PH003', name: 'Google Pixel 8', price: 699, stock: 100, category: 'Mobile Phones' },
        { id: 'PH004', name: 'OnePlus 12', price: 650, stock: 110, category: 'Mobile Phones' },
        { id: 'PH005', name: 'Xiaomi 14 Pro', price: 550, stock: 130, category: 'Mobile Phones' },
        { id: 'PH006', name: 'iPhone 14', price: 799, stock: 95, category: 'Mobile Phones' },
        { id: 'PH007', name: 'Samsung Galaxy A54', price: 400, stock: 140, category: 'Mobile Phones' },

        // ========== LAPTOPS ==========
        { id: 'LP001', name: 'MacBook Air M2', price: 1100, stock: 60, category: 'Laptops' },
        { id: 'LP002', name: 'Dell XPS 13', price: 1200, stock: 55, category: 'Laptops' },
        { id: 'LP003', name: 'HP Spectre x360', price: 1050, stock: 50, category: 'Laptops' },
        { id: 'LP004', name: 'Lenovo ThinkPad X1', price: 1300, stock: 45, category: 'Laptops' },
        { id: 'LP005', name: 'ASUS ROG Gaming Laptop', price: 1500, stock: 40, category: 'Laptops' },
        { id: 'LP006', name: 'Acer Aspire 5', price: 650, stock: 80, category: 'Laptops' },

        // ========== TABLETS ==========
        { id: 'TB001', name: 'iPad Pro 12.9"', price: 1099, stock: 70, category: 'Tablets' },
        { id: 'TB002', name: 'Samsung Galaxy Tab S9', price: 799, stock: 85, category: 'Tablets' },
        { id: 'TB003', name: 'iPad Air', price: 599, stock: 90, category: 'Tablets' },
        { id: 'TB004', name: 'Amazon Fire HD 10', price: 150, stock: 120, category: 'Tablets' },

        // ========== AUDIO & HEADPHONES ==========
        { id: 'AU001', name: 'AirPods Pro 2', price: 249, stock: 200, category: 'Audio & Headphones' },
        { id: 'AU002', name: 'Samsung Galaxy Buds', price: 149, stock: 180, category: 'Audio & Headphones' },
        { id: 'AU003', name: 'Sony WH-1000XM5', price: 348, stock: 150, category: 'Audio & Headphones' },
        { id: 'AU004', name: 'Bose QuietComfort 45', price: 329, stock: 140, category: 'Audio & Headphones' },
        { id: 'AU005', name: 'JBL Flip 6 Speaker', price: 129, stock: 160, category: 'Audio & Headphones' },
        { id: 'AU006', name: 'Marshall Bluetooth Speaker', price: 199, stock: 110, category: 'Audio & Headphones' },

        // ========== SMARTWATCHES ==========
        { id: 'SW001', name: 'Apple Watch Series 9', price: 399, stock: 100, category: 'Smartwatches' },
        { id: 'SW002', name: 'Samsung Galaxy Watch 6', price: 299, stock: 120, category: 'Smartwatches' },
        { id: 'SW003', name: 'Fitbit Versa 4', price: 199, stock: 130, category: 'Smartwatches' },
        { id: 'SW004', name: 'Garmin Forerunner 255', price: 349, stock: 90, category: 'Smartwatches' },

        // ========== GAMING CONSOLES ==========
        { id: 'GM001', name: 'PlayStation 5', price: 499, stock: 60, category: 'Gaming Consoles' },
        { id: 'GM002', name: 'Xbox Series X', price: 499, stock: 55, category: 'Gaming Consoles' },
        { id: 'GM003', name: 'Nintendo Switch OLED', price: 349, stock: 80, category: 'Gaming Consoles' },
        { id: 'GM004', name: 'Steam Deck', price: 399, stock: 50, category: 'Gaming Consoles' },

        // ========== CAMERAS ==========
        { id: 'CM001', name: 'Canon EOS R6', price: 2499, stock: 30, category: 'Cameras' },
        { id: 'CM002', name: 'Sony A7 IV', price: 2499, stock: 35, category: 'Cameras' },
        { id: 'CM003', name: 'GoPro Hero 12', price: 399, stock: 70, category: 'Cameras' },
        { id: 'CM004', name: 'DJI Mini 3 Pro Drone', price: 759, stock: 45, category: 'Cameras' },

        // ========== SMART HOME ==========
        { id: 'SH001', name: 'Amazon Echo Dot', price: 49, stock: 200, category: 'Smart Home' },
        { id: 'SH002', name: 'Google Nest Hub', price: 99, stock: 150, category: 'Smart Home' },
        { id: 'SH003', name: 'Ring Video Doorbell', price: 99, stock: 130, category: 'Smart Home' },
        { id: 'SH004', name: 'Philips Hue Starter Kit', price: 199, stock: 100, category: 'Smart Home' },

        // ========== COMPUTER ACCESSORIES ==========
        { id: 'CA001', name: 'Logitech MX Master 3 Mouse', price: 99, stock: 180, category: 'Computer Accessories' },
        { id: 'CA002', name: 'Mechanical Keyboard RGB', price: 149, stock: 160, category: 'Computer Accessories' },
        { id: 'CA003', name: 'Dell 27" Monitor 4K', price: 399, stock: 90, category: 'Computer Accessories' },
        { id: 'CA004', name: 'Webcam HD 1080p', price: 79, stock: 140, category: 'Computer Accessories' },
    ],
    orders: [],
    carts: {}, // userId -> { items: [] }
    feedback: []
};

function readDb() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
        return INITIAL_DATA;
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return INITIAL_DATA;
    }
}

function writeDb(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getInventory() {
    const db = readDb();
    return db.inventory;
}

export function updateInventory(itemId, quantityChange) {
    const db = readDb();
    const itemIndex = db.inventory.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
        db.inventory[itemIndex].stock += quantityChange;
        writeDb(db);
        return true;
    }
    return false;
}

export function createOrder(orderData) {
    const db = readDb();

    // 1. Validate Stock Availability & Calculate Total
    let calculatedTotal = 0;

    for (const item of orderData.items) {
        const invItem = db.inventory.find(i => i.id === item.id);
        if (!invItem) throw new Error(`Product ${item.id} not found.`);
        if (invItem.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${invItem.name}. Only ${invItem.stock} left.`);
        }
        calculatedTotal += (invItem.price * item.quantity);
    }

    // No shipping cost - just product total
    // Payment method is stored for reference

    const newOrder = {
        id: `ORD${Date.now()}`,
        date: new Date().toISOString(),
        status: 'Confirmed', // Initial status
        email: orderData.email || null, // Store email if provided
        total: calculatedTotal, // STORE THE TOTAL!
        ...orderData
    };
    db.orders.push(newOrder);

    // 2. Deduct stock (now safe)
    orderData.items.forEach(item => {
        const invItem = db.inventory.find(i => i.id === item.id);
        if (invItem) {
            invItem.stock -= item.quantity;
        }
    });

    writeDb(db);
    return newOrder;
}

export function getOrders(userId) { // simple userId filter if needed, or all
    const db = readDb();
    if (userId) return db.orders.filter(o => o.userId === userId);
    return db.orders;
}

export function getOrderById(orderId) {
    const db = readDb();
    return db.orders.find(o => o.id === orderId);
}

export function updateOrderStatus(orderId, status) {
    const db = readDb();
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        writeDb(db);
        return order;
    }
    return null;
}

export function updateOrder(orderId, updates) {
    const db = readDb();
    const orderIndex = db.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return null;
    const order = db.orders[orderIndex];

    // Only allow modification if Confirmed (not Shipped/Delivered)
    if (order.status !== 'Confirmed') {
        throw new Error(`Order is ${order.status} and cannot be modified.`);
    }

    // 1. Handle Address/Payment (Simple)
    if (updates.address) order.address = updates.address;
    if (updates.paymentMethod) order.paymentMethod = updates.paymentMethod;

    // 2. Handle Item Updates (Complex: Revert Old -> Deduct New)
    if (updates.items) {
        // A. Revert Inventory for OLD items
        order.items.forEach(oldItem => {
            const invItem = db.inventory.find(i => i.id === oldItem.id);
            if (invItem) invItem.stock += oldItem.quantity; // Put back
        });

        // B. Validate & Deduct Inventory for NEW items
        let newTotal = 0;
        try {
            updates.items.forEach(newItem => {
                const invItem = db.inventory.find(i => i.id === newItem.id);
                if (!invItem) throw new Error(`Product ${newItem.id} not found.`);

                if (invItem.stock < newItem.quantity) {
                    throw new Error(`Insufficient stock for ${invItem.name} (Requested: ${newItem.quantity}, Available: ${invItem.stock}).`);
                }

                invItem.stock -= newItem.quantity; // Take out
                newTotal += (invItem.price * newItem.quantity);
            });
        } catch (error) {
            // Rollback: Logic is tricky without transaction, but we modified in-memory 'db' object. 
            // Since we haven't called writeDb yet, we can simple NOT save and throw.
            // However, we effectively "dirtied" the in-memory db object above (Revert step).
            // For a file-based DB, it's safer to re-read or just be careful. 
            // In this simple synchronous flow, throwing here prevents writeDb, effectively rolling back.
            throw error;
        }

        order.items = updates.items;
        order.total = newTotal;
    }

    db.orders[orderIndex] = order;
    writeDb(db);
    return order;
}

export function cancelOrder(orderId) {
    const db = readDb();
    const order = db.orders.find(o => o.id === orderId);
    if (order && order.status !== 'Shipped' && order.status !== 'Delivered' && order.status !== 'Cancelled') {
        order.status = 'Cancelled';
        // Restore stock
        order.items.forEach(item => {
            const invItem = db.inventory.find(i => i.id === item.id);
            if (invItem) invItem.stock += item.quantity;
        });
        writeDb(db);
        return order;
    }
    return null;
}

// Enhanced Order Fetching
export function getCustomerOrders(customerName) {
    const db = readDb();
    // Case-insensitive fuzzy match or exact match
    return db.orders.filter(o =>
        (o.customerName && o.customerName.toLowerCase().includes(customerName.toLowerCase())) ||
        (o.address && o.address.toLowerCase().includes(customerName.toLowerCase()))
    ).slice(-5); // Return last 5
}

export function addReturnRequest(orderId, reason) {
    const db = readDb();
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'Return Requested';
        order.returnReason = reason;
        writeDb(db);
        return { ticketId: `RET${Date.now()}`, status: 'Pending Approval' };
    }
    return null;
}

export function addFeedback(feedback) {
    const db = readDb();
    db.feedback.push({ id: Date.now(), text: feedback, date: new Date().toISOString() });
    writeDb(db);
}
