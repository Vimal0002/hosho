
const fs = require('fs');
const path = require('path');
const { PRODUCT_IMAGES } = require('./product-images');

const DB_PATH = path.join(process.cwd(), 'database.json');

const INITIAL_DATA = {
    inventory: [
        // ========== TELEVISIONS ==========
        { id: 'TV001', name: 'Sony Bravia 55" 4K TV', price: 54990, mrp: 74900, stock: 50, category: 'Televisions', rating: 4.5 },
        { id: 'TV002', name: 'Samsung 65" QLED TV', price: 79990, mrp: 109900, stock: 60, category: 'Televisions', rating: 4.6 },
        { id: 'TV003', name: 'LG OLED 55" TV', price: 99990, mrp: 139900, stock: 45, category: 'Televisions', rating: 4.8 },
        { id: 'TV004', name: 'TCL 43" Smart TV', price: 24990, mrp: 34990, stock: 80, category: 'Televisions', rating: 4.2 },
        { id: 'TV005', name: 'Hisense 50" 4K TV', price: 32990, mrp: 44990, stock: 70, category: 'Televisions', rating: 4.1 },

        // ========== HOME APPLIANCES ==========
        { id: 'FR001', name: 'LG 260L Frost Free Fridge', price: 26990, mrp: 32990, stock: 75, category: 'Home Appliances', rating: 4.3 },
        { id: 'FR002', name: 'Samsung Double Door Fridge', price: 64990, mrp: 79900, stock: 80, category: 'Home Appliances', rating: 4.5 },
        { id: 'FR003', name: 'Whirlpool 200L Single Door Fridge', price: 18990, mrp: 22990, stock: 90, category: 'Home Appliances', rating: 4.2 },
        { id: 'MW001', name: 'Whirlpool Microwave 20L', price: 7490, mrp: 9990, stock: 100, category: 'Home Appliances', rating: 4.0 },
        { id: 'MW002', name: 'Samsung Convection Microwave 28L', price: 14990, mrp: 19990, stock: 85, category: 'Home Appliances', rating: 4.4 },
        { id: 'WM001', name: 'Bosch Front Load Washer', price: 36990, mrp: 44990, stock: 65, category: 'Home Appliances', rating: 4.6 },
        { id: 'WM002', name: 'LG Top Load Washer 7kg', price: 24990, mrp: 29990, stock: 70, category: 'Home Appliances', rating: 4.3 },
        { id: 'AC001', name: 'Daikin 1.5 Ton AC', price: 42990, mrp: 54990, stock: 60, category: 'Home Appliances', rating: 4.5 },
        { id: 'AC002', name: 'Voltas Split AC 1 Ton', price: 31990, mrp: 39990, stock: 75, category: 'Home Appliances', rating: 4.2 },

        // ========== MOBILE PHONES ==========
        { id: 'PH001', name: 'iPhone 15', price: 79990, mrp: 89900, stock: 150, category: 'Mobile Phones', rating: 4.7 },
        { id: 'PH002', name: 'Samsung Galaxy S24', price: 74999, mrp: 84999, stock: 120, category: 'Mobile Phones', rating: 4.6 },
        { id: 'PH003', name: 'Google Pixel 8', price: 52999, mrp: 62999, stock: 100, category: 'Mobile Phones', rating: 4.5 },
        { id: 'PH004', name: 'OnePlus 12', price: 49999, mrp: 59999, stock: 110, category: 'Mobile Phones', rating: 4.5 },
        { id: 'PH005', name: 'Xiaomi 14 Pro', price: 42999, mrp: 49999, stock: 130, category: 'Mobile Phones', rating: 4.3 },
        { id: 'PH006', name: 'iPhone 14', price: 59999, mrp: 69900, stock: 95, category: 'Mobile Phones', rating: 4.6 },
        { id: 'PH007', name: 'Samsung Galaxy A54', price: 29999, mrp: 38999, stock: 140, category: 'Mobile Phones', rating: 4.2 },

        // ========== LAPTOPS ==========
        { id: 'LP001', name: 'MacBook Air M2', price: 89990, mrp: 114900, stock: 60, category: 'Laptops', rating: 4.8 },
        { id: 'LP002', name: 'Dell XPS 13', price: 99990, mrp: 124900, stock: 55, category: 'Laptops', rating: 4.6 },
        { id: 'LP003', name: 'HP Spectre x360', price: 84990, mrp: 104900, stock: 50, category: 'Laptops', rating: 4.5 },
        { id: 'LP004', name: 'Lenovo ThinkPad X1', price: 109990, mrp: 139900, stock: 45, category: 'Laptops', rating: 4.7 },
        { id: 'LP005', name: 'ASUS ROG Gaming Laptop', price: 124990, mrp: 149990, stock: 40, category: 'Laptops', rating: 4.6 },
        { id: 'LP006', name: 'Acer Aspire 5', price: 49990, mrp: 59990, stock: 80, category: 'Laptops', rating: 4.1 },

        // ========== TABLETS ==========
        { id: 'TB001', name: 'iPad Pro 12.9"', price: 89990, mrp: 112900, stock: 70, category: 'Tablets', rating: 4.8 },
        { id: 'TB002', name: 'Samsung Galaxy Tab S9', price: 62999, mrp: 74999, stock: 85, category: 'Tablets', rating: 4.5 },
        { id: 'TB003', name: 'iPad Air', price: 46990, mrp: 59900, stock: 90, category: 'Tablets', rating: 4.6 },
        { id: 'TB004', name: 'Amazon Fire HD 10', price: 11999, mrp: 14999, stock: 120, category: 'Tablets', rating: 4.0 },

        // ========== AUDIO & HEADPHONES ==========
        { id: 'AU001', name: 'AirPods Pro 2', price: 20990, mrp: 26900, stock: 200, category: 'Audio & Headphones', rating: 4.7 },
        { id: 'AU002', name: 'Samsung Galaxy Buds', price: 11999, mrp: 14999, stock: 180, category: 'Audio & Headphones', rating: 4.3 },
        { id: 'AU003', name: 'Sony WH-1000XM5', price: 27990, mrp: 34990, stock: 150, category: 'Audio & Headphones', rating: 4.8 },
        { id: 'AU004', name: 'Bose QuietComfort 45', price: 25990, mrp: 32990, stock: 140, category: 'Audio & Headphones', rating: 4.7 },
        { id: 'AU005', name: 'JBL Flip 6 Speaker', price: 9999, mrp: 12999, stock: 160, category: 'Audio & Headphones', rating: 4.4 },
        { id: 'AU006', name: 'Marshall Bluetooth Speaker', price: 15990, mrp: 19990, stock: 110, category: 'Audio & Headphones', rating: 4.5 },

        // ========== SMARTWATCHES ==========
        { id: 'SW001', name: 'Apple Watch Series 9', price: 32990, mrp: 41900, stock: 100, category: 'Smartwatches', rating: 4.6 },
        { id: 'SW002', name: 'Samsung Galaxy Watch 6', price: 23999, mrp: 29999, stock: 120, category: 'Smartwatches', rating: 4.4 },
        { id: 'SW003', name: 'Fitbit Versa 4', price: 15999, mrp: 19999, stock: 130, category: 'Smartwatches', rating: 4.2 },
        { id: 'SW004', name: 'Garmin Forerunner 255', price: 28999, mrp: 36990, stock: 90, category: 'Smartwatches', rating: 4.6 },

        // ========== GAMING CONSOLES ==========
        { id: 'GM001', name: 'PlayStation 5', price: 44990, mrp: 54990, stock: 60, category: 'Gaming Consoles', rating: 4.8 },
        { id: 'GM002', name: 'Xbox Series X', price: 44990, mrp: 54990, stock: 55, category: 'Gaming Consoles', rating: 4.7 },
        { id: 'GM003', name: 'Nintendo Switch OLED', price: 27990, mrp: 34990, stock: 80, category: 'Gaming Consoles', rating: 4.6 },
        { id: 'GM004', name: 'Steam Deck', price: 32990, mrp: 39990, stock: 50, category: 'Gaming Consoles', rating: 4.5 },

        // ========== CAMERAS ==========
        { id: 'CM001', name: 'Canon EOS R6', price: 199990, mrp: 239990, stock: 30, category: 'Cameras', rating: 4.8 },
        { id: 'CM002', name: 'Sony A7 IV', price: 189990, mrp: 229990, stock: 35, category: 'Cameras', rating: 4.8 },
        { id: 'CM003', name: 'GoPro Hero 12', price: 32990, mrp: 39990, stock: 70, category: 'Cameras', rating: 4.5 },
        { id: 'CM004', name: 'DJI Mini 3 Pro Drone', price: 62990, mrp: 74990, stock: 45, category: 'Cameras', rating: 4.6 },

        // ========== SMART HOME ==========
        { id: 'SH001', name: 'Amazon Echo Dot', price: 3999, mrp: 5499, stock: 200, category: 'Smart Home', rating: 4.3 },
        { id: 'SH002', name: 'Google Nest Hub', price: 7999, mrp: 9999, stock: 150, category: 'Smart Home', rating: 4.4 },
        { id: 'SH003', name: 'Ring Video Doorbell', price: 8999, mrp: 11999, stock: 130, category: 'Smart Home', rating: 4.3 },
        { id: 'SH004', name: 'Philips Hue Starter Kit', price: 15999, mrp: 19999, stock: 100, category: 'Smart Home', rating: 4.5 },

        // ========== COMPUTER ACCESSORIES ==========
        { id: 'CA001', name: 'Logitech MX Master 3 Mouse', price: 7999, mrp: 10999, stock: 180, category: 'Computer Accessories', rating: 4.6 },
        { id: 'CA002', name: 'Mechanical Keyboard RGB', price: 11999, mrp: 14999, stock: 160, category: 'Computer Accessories', rating: 4.4 },
        { id: 'CA003', name: 'Dell 27" Monitor 4K', price: 32990, mrp: 39990, stock: 90, category: 'Computer Accessories', rating: 4.5 },
        { id: 'CA004', name: 'Webcam HD 1080p', price: 5999, mrp: 7999, stock: 140, category: 'Computer Accessories', rating: 4.1 },
    ],
    orders: [],
    carts: {},
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
    // Attach image URLs to each product
    return db.inventory.map(item => ({
        ...item,
        image: PRODUCT_IMAGES[item.id] || null,
        discount: item.mrp ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0
    }));
}

export function getProductById(productId) {
    const inventory = getInventory();
    return inventory.find(i => i.id === productId) || null;
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

    let calculatedTotal = 0;

    for (const item of orderData.items) {
        const invItem = db.inventory.find(i => i.id === item.id);
        if (!invItem) throw new Error(`Product ${item.id} not found.`);
        if (invItem.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${invItem.name}. Only ${invItem.stock} left.`);
        }
        calculatedTotal += (invItem.price * item.quantity);
    }

    const newOrder = {
        id: `ORD${Date.now()}`,
        date: new Date().toISOString(),
        status: 'Confirmed',
        email: orderData.email || null,
        total: calculatedTotal,
        ...orderData
    };
    db.orders.push(newOrder);

    orderData.items.forEach(item => {
        const invItem = db.inventory.find(i => i.id === item.id);
        if (invItem) {
            invItem.stock -= item.quantity;
        }
    });

    writeDb(db);
    return newOrder;
}

export function getOrders(userId) {
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

    if (order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Returned') {
        throw new Error(`Order is ${order.status} and cannot be modified.`);
    }

    if (updates.address) order.address = updates.address;
    if (updates.paymentMethod) order.paymentMethod = updates.paymentMethod;

    if (updates.items) {
        order.items.forEach(oldItem => {
            const invItem = db.inventory.find(i => i.id === oldItem.id);
            if (invItem) invItem.stock += oldItem.quantity;
        });

        let newTotal = 0;
        try {
            updates.items.forEach(newItem => {
                const invItem = db.inventory.find(i => i.id === newItem.id);
                if (!invItem) throw new Error(`Product ${newItem.id} not found.`);

                if (invItem.stock < newItem.quantity) {
                    throw new Error(`Insufficient stock for ${invItem.name} (Requested: ${newItem.quantity}, Available: ${invItem.stock}).`);
                }

                invItem.stock -= newItem.quantity;
                newTotal += (invItem.price * newItem.quantity);
            });
        } catch (error) {
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
        order.items.forEach(item => {
            const invItem = db.inventory.find(i => i.id === item.id);
            if (invItem) invItem.stock += item.quantity;
        });
        writeDb(db);
        return order;
    }
    return null;
}

export function getCustomerOrders(customerName) {
    const db = readDb();
    return db.orders.filter(o =>
        (o.customerName && o.customerName.toLowerCase().includes(customerName.toLowerCase())) ||
        (o.address && o.address.toLowerCase().includes(customerName.toLowerCase()))
    ).slice(-5);
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

// ========== CART MANAGEMENT ==========

export function addToCart(userId, productId, quantity) {
    const db = readDb();

    const product = db.inventory.find(i => i.id === productId);
    if (!product) throw new Error("Product not found");
    if (product.stock < quantity) throw new Error(`Not enough stock. Only ${product.stock} left.`);

    if (!db.carts[userId]) db.carts[userId] = { items: [] };

    const existingItem = db.carts[userId].items.find(i => i.id === productId);
    if (existingItem) {
        if (product.stock < (existingItem.quantity + quantity)) {
            throw new Error(`Cannot add more. You have ${existingItem.quantity} + ${quantity} (Total ${existingItem.quantity + quantity}) but only ${product.stock} in stock.`);
        }
        existingItem.quantity += quantity;
    } else {
        db.carts[userId].items.push({ id: productId, quantity: quantity });
    }

    writeDb(db);
    return db.carts[userId];
}

export function getCart(userId) {
    const db = readDb();
    const cart = db.carts[userId];
    if (!cart || cart.items.length === 0) return null;

    const items = cart.items.map(cartItem => {
        const invItem = db.inventory.find(i => i.id === cartItem.id);
        if (!invItem) return null;
        return {
            ...cartItem,
            name: invItem.name,
            price: invItem.price,
            image: PRODUCT_IMAGES[cartItem.id] || null,
            total: invItem.price * cartItem.quantity
        };
    }).filter(i => i !== null);

    const grandTotal = items.reduce((sum, i) => sum + i.total, 0);
    return { items, grandTotal };
}

export function removeFromCart(userId, productId) {
    const db = readDb();
    if (!db.carts[userId]) return null;

    if (productId === 'ALL') {
        db.carts[userId] = { items: [] };
    } else {
        db.carts[userId].items = db.carts[userId].items.filter(i => i.id !== productId);
    }
    writeDb(db);
    return getCart(userId);
}

export function checkoutCart(userId, orderDetails) {
    const db = readDb();
    const cart = getCart(userId);
    if (!cart) throw new Error("Cart is empty");

    const dbRefs = readDb();

    cart.items.forEach(item => {
        const invItem = dbRefs.inventory.find(i => i.id === item.id);
        if (invItem.stock < item.quantity) {
            throw new Error(`Stock changed! ${item.name} only has ${invItem.stock} left.`);
        }
    });

    try {
        const order = createOrder({
            ...orderDetails,
            items: cart.items.map(i => ({ id: i.id, quantity: i.quantity }))
        });

        removeFromCart(userId, 'ALL');
        return order;
    } catch (e) {
        throw e;
    }
}
