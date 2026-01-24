const { db } = require('./db-sqlite');

// ========== INVENTORY FUNCTIONS ==========

function getInventory() {
    try {
        const stmt = db.prepare('SELECT * FROM inventory ORDER BY category, name');
        return stmt.all();
    } catch (error) {
        console.error('Error getting inventory:', error);
        return [];
    }
}

function getProductById(id) {
    try {
        const stmt = db.prepare('SELECT * FROM inventory WHERE id = ?');
        return stmt.get(id) || null;
    } catch (error) {
        console.error('Error getting product:', error);
        return null;
    }
}

// ========== ORDER FUNCTIONS ==========

function createOrder(orderData) {
    try {
        const orderId = `ORD${Date.now()}`;

        const insertOrder = db.transaction(() => {
            // Insert order
            const stmt = db.prepare(
                `INSERT INTO orders (id, customer_name, email, total, status, payment_method, shipping_address) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
            );

            stmt.run(
                orderId,
                orderData.customerName || 'Guest User',
                orderData.email || 'guest@electrominds.com',
                orderData.total,
                'Confirmed',
                orderData.paymentMethod,
                orderData.address || orderData.shippingAddress
            );

            // Insert order items and update stock
            const insertItem = db.prepare(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
            );

            const updateStock = db.prepare(
                'UPDATE inventory SET stock = stock - ? WHERE id = ?'
            );

            for (const item of orderData.items) {
                const product = getProductById(item.id);
                insertItem.run(orderId, item.id, item.quantity, product?.price || 0);
                updateStock.run(item.quantity, item.id);
            }
        });

        insertOrder();

        // Get complete order
        return getOrderById(orderId);
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

function getOrders() {
    try {
        const stmt = db.prepare(`
            SELECT id, customer_name as customerName, email, total, status, 
                   payment_method as paymentMethod, shipping_address as shippingAddress,
                   created_at as date
            FROM orders
            ORDER BY created_at DESC
        `);

        const orders = stmt.all();

        // Get items for each order
        const itemsStmt = db.prepare(
            'SELECT product_id as id, quantity FROM order_items WHERE order_id = ?'
        );

        for (const order of orders) {
            order.items = itemsStmt.all(order.id);
        }

        return orders;
    } catch (error) {
        console.error('Error getting orders:', error);
        return [];
    }
}

function getOrderById(orderId) {
    try {
        const stmt = db.prepare(`
            SELECT id, customer_name as customerName, email, total, status, 
                   payment_method as paymentMethod, shipping_address as shippingAddress,
                   created_at as date
            FROM orders
            WHERE id = ?
        `);

        const order = stmt.get(orderId);
        if (!order) return null;

        // Get order items
        const itemsStmt = db.prepare(
            'SELECT product_id as id, quantity FROM order_items WHERE order_id = ?'
        );
        order.items = itemsStmt.all(orderId);

        return order;
    } catch (error) {
        console.error('Error getting order:', error);
        return null;
    }
}

function getCustomerOrders(email) {
    try {
        const stmt = db.prepare(`
            SELECT id, customer_name as customerName, email, total, status, 
                   payment_method as paymentMethod, shipping_address as shippingAddress,
                   created_at as date
            FROM orders
            WHERE email = ?
            ORDER BY created_at DESC
        `);

        const orders = stmt.all(email);

        // Get items for each order
        const itemsStmt = db.prepare(
            'SELECT product_id as id, quantity FROM order_items WHERE order_id = ?'
        );

        for (const order of orders) {
            order.items = itemsStmt.all(order.id);
        }

        return orders;
    } catch (error) {
        console.error('Error getting customer orders:', error);
        return [];
    }
}

function updateOrderStatus(orderId, status) {
    try {
        const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
        stmt.run(status, orderId);
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
}

function updateOrder(orderId, updates) {
    try {
        const fields = [];
        const values = [];

        if (updates.status) {
            fields.push('status = ?');
            values.push(updates.status);
        }
        if (updates.paymentMethod) {
            fields.push('payment_method = ?');
            values.push(updates.paymentMethod);
        }
        if (updates.shippingAddress) {
            fields.push('shipping_address = ?');
            values.push(updates.shippingAddress);
        }

        if (fields.length > 0) {
            values.push(orderId);
            const stmt = db.prepare(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`);
            stmt.run(...values);
        }

        return true;
    } catch (error) {
        console.error('Error updating order:', error);
        return false;
    }
}

function cancelOrder(orderId) {
    try {
        const cancelTransaction = db.transaction(() => {
            // Get order items
            const itemsStmt = db.prepare(
                'SELECT product_id, quantity FROM order_items WHERE order_id = ?'
            );
            const items = itemsStmt.all(orderId);

            // Restore stock
            const updateStock = db.prepare(
                'UPDATE inventory SET stock = stock + ? WHERE id = ?'
            );

            for (const item of items) {
                updateStock.run(item.quantity, item.product_id);
            }

            // Update order status
            const updateStatus = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
            updateStatus.run('Cancelled', orderId);
        });

        cancelTransaction();
        return true;
    } catch (error) {
        console.error('Error cancelling order:', error);
        return false;
    }
}

// ========== RETURN FUNCTIONS ==========

function addReturnRequest(orderId, reason) {
    try {
        const returnId = `RET${Date.now()}`;

        const returnTransaction = db.transaction(() => {
            // Insert return request
            const insertReturn = db.prepare(
                'INSERT INTO returns (id, order_id, reason, status) VALUES (?, ?, ?, ?)'
            );
            insertReturn.run(returnId, orderId, reason, 'Pending');

            // Update order status
            const updateStatus = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
            updateStatus.run('Return Requested', orderId);

            // Restore stock
            const itemsStmt = db.prepare(
                'SELECT product_id, quantity FROM order_items WHERE order_id = ?'
            );
            const items = itemsStmt.all(orderId);

            const updateStock = db.prepare(
                'UPDATE inventory SET stock = stock + ? WHERE id = ?'
            );

            for (const item of items) {
                updateStock.run(item.quantity, item.product_id);
            }
        });

        returnTransaction();
        return returnId;
    } catch (error) {
        console.error('Error adding return request:', error);
        return null;
    }
}

// ========== FEEDBACK FUNCTIONS ==========

function addFeedback(feedbackData) {
    try {
        const stmt = db.prepare(
            'INSERT INTO feedback (customer_email, message, rating) VALUES (?, ?, ?)'
        );
        stmt.run(feedbackData.email, feedbackData.message, feedbackData.rating || 5);
        return true;
    } catch (error) {
        console.error('Error adding feedback:', error);
        return false;
    }
}

module.exports = {
    getInventory,
    getProductById,
    createOrder,
    getOrders,
    getOrderById,
    getCustomerOrders,
    updateOrderStatus,
    updateOrder,
    cancelOrder,
    addReturnRequest,
    addFeedback
};
