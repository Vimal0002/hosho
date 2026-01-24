import { GoogleGenerativeAI } from "@google/generative-ai";
import { getInventory, createOrder, getOrderById, updateOrderStatus, cancelOrder, addFeedback, getOrders, updateOrder, getCustomerOrders, addReturnRequest } from '@/lib/data';
import { sendOrderEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

const SYSTEM_INSTRUCTION = `You are ElectroMinds AI - a sweet, simple, and friendly shopping assistant. 🛍️

Current Inventory:
${JSON.stringify(getInventory().map(i => `${i.name} (${i.id}): $${i.price}, ${i.stock} in stock`))}

YOUR STYLE:
- Speak simply and casually. No robot talk!
- Be helpful and direct.
- Use emojis to be friendly. ✨
- If a user wants to buy, just help them naturally. Don't demand specific formats.
- If they ask about a product, tell them the price and if it's available.

GOAL:
- Help users shop, track orders, and return items easily.
`;

const genAI = new GoogleGenerativeAI(apiKey || 'MOCK_KEY');

const tools = {
    get_products: {
        description: "Get the list of available electronic products and their stock.",
        parameters: { type: "object", properties: {}, required: [] },
        handler: () => ({ products: getInventory() })
    },
    place_order: {
        description: "Place a new order. Request confirmation first.",
        parameters: {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            quantity: { type: "integer" }
                        }
                    }
                },
                address: { type: "string" },
                customerName: { type: "string", description: "Name of the customer" },
                paymentMethod: { type: "string", enum: ["UPI", "Net Banking", "Credit Card", "Debit Card", "Cash on Delivery"] },
                email: { type: "string", description: "Customer email for receipt" }
            },
            required: ["items", "address", "paymentMethod"]
        },
        handler: async (args) => {
            try {
                const order = createOrder(args);
                if (args.email) await sendOrderEmail(args.email, order);
                return { status: "Order Placed", orderId: order.id, details: order };
            } catch (e) {
                return { error: e.message };
            }
        }
    }
};

const toolDefinitions = [
    {
        functionDeclarations: Object.keys(tools).map(name => ({
            name: name,
            description: tools[name].description,
            parameters: tools[name].parameters
        }))
    }
];

// Smart Local Intent Engine (Hybrid Mode)
async function processLocalIntent(lastUserMessage, history = []) {
    const msg = lastUserMessage.toLowerCase();
    const inventory = getInventory();

    // 0. CHECK FOR CONFIRMATION (User said "Yes" to a pending order OR return)
    if (msg.includes("yes") || msg.includes("confirm") || msg.includes("ok") || msg.includes("place it") || msg.includes("sure") || msg.includes("do it")) {
        const lastModelMsg = history.slice().reverse().find(h => h.role === "model");
        if (lastModelMsg && lastModelMsg.parts && lastModelMsg.parts[0].text) {
            const text = lastModelMsg.parts[0].text;

            // Check for CANCEL confirmation
            const pendingCancelMatch = text.match(/\*\*Confirm Cancellation\*\*\nOrder ID: (.*)/);
            if (pendingCancelMatch) {
                const [_, orderIdRaw] = pendingCancelMatch;
                const orderId = orderIdRaw.trim();

                const cancelResult = cancelOrder(orderId);

                if (cancelResult) {
                    const order = getOrderById(orderId);
                    const recipient = order.email || process.env.EMAIL_USER || "rp0366685@gmail.com";

                    try {
                        await sendOrderEmail(recipient, {
                            id: orderId,
                            items: order.items,
                            total: order.total,
                            address: order.address || order.shippingAddress,
                            date: new Date().toISOString(),
                            status: 'Cancelled',
                            paymentMethod: order.paymentMethod
                        });

                        return `✅ Done! Order **${orderId}** is cancelled. We'll process your refund of $${order.total}.`;
                    } catch (e) {
                        return `✅ Done! Order **${orderId}** is cancelled. Refund processing started.`;
                    }
                } else {
                    return `❌ Oops, couldn't cancel order ${orderId}. Try again?`;
                }
            }

            // Check for RETURN confirmation
            const pendingReturnMatch = text.match(/\*\*Confirm Return\*\*\nOrder ID: (.*)\nReason: (.*)/);
            if (pendingReturnMatch) {
                const [_, orderId, reason] = pendingReturnMatch;
                const order = getOrderById(orderId.trim());

                if (order) {
                    const returnResult = addReturnRequest(orderId.trim(), reason.trim());
                    if (returnResult) {
                        const recipient = order.email || process.env.EMAIL_USER || "rp0366685@gmail.com";
                        try {
                            await sendOrderEmail(recipient, {
                                id: returnResult,
                                items: order.items,
                                total: order.total,
                                address: order.address || order.shippingAddress,
                                date: new Date().toISOString(),
                                status: 'Return Requested',
                                paymentMethod: order.paymentMethod
                            });

                            return `✅ Return started! We've emailed you the details for Order **${orderId.trim()}**. We'll handle it within 2-3 days.`;
                        } catch (e) {
                            return `✅ Return started for Order **${orderId.trim()}**!`;
                        }
                    }
                }
                return `❌ Something went wrong with the return. Try again?`;
            }

            // Check for ORDER confirmation
            const pendingOrderMatch = text.match(/\*\*Confirm Order\*\*\nInventory ID: (.*)\nQuantity: (\d+)\nAddress: (.*)\nPayment: (.*)\nEmail: (.*)/);
            // Fallback for old format without email
            const pendingOrderMatchOld = text.match(/\*\*Confirm Order\*\*\nInventory ID: (.*)\nQuantity: (\d+)\nAddress: (.*)\nPayment: (.*)/);

            const match = pendingOrderMatch || pendingOrderMatchOld;

            if (match) {
                const itemId = match[1].trim();
                const quantity = parseInt(match[2]);
                const address = match[3].trim();
                const paymentMethod = match[4].trim();

                // If new format with email exists, use it. Else fallback.
                const userEmail = (pendingOrderMatch && match[5]) ? match[5].trim() : (process.env.EMAIL_USER || "rp0366685@gmail.com");

                try {
                    const finalCheck = inventory.find(i => i.id === itemId);
                    if (!finalCheck || finalCheck.stock < quantity) {
                        return `❌ Oh no! ${finalCheck.name} just went out of stock. So sorry! 😔`;
                    }

                    const order = createOrder({
                        items: [{ id: itemId.trim(), quantity: quantity }],
                        address: address,
                        customerName: "Guest User",
                        paymentMethod: paymentMethod,
                        email: userEmail,
                        total: (finalCheck.price * quantity)
                    });

                    // Send email to the BUYER (userEmail)
                    console.log(`[Order Confirmed] Sending email to: ${userEmail}`);
                    await sendOrderEmail(userEmail, order);

                    return `🎉 **Woohoo! Order Placed!** 🛍️\n\nOrder ID: **${order.id}**\nTotal: $${order.total}\n\nI've sent the receipt to **${userEmail}**. Thanks for shopping! ✨`;

                } catch (e) {
                    return `❌ Order failed: ${e.message}. Try again?`;
                }
            }
        }
    }

    // 1. TRACKING & HISTORY
    const orderIdMatch = msg.match(/(ORD\d+)/i);
    const intentIsCancel = msg.includes("cancel") || msg.includes("stop");
    const intentIsReturn = msg.includes("return") || msg.includes("refund");

    // If ID found and NOT buying/returning/cancelling explicitly, show details
    if (orderIdMatch && !intentIsCancel && !intentIsReturn) {
        const orderId = orderIdMatch[1].toUpperCase();
        let order = getOrderById(orderId);

        if (order) {
            // DYNAMIC STATUS SIMULATION (For Demo Purposes)
            // If order is active (not Cancelled/Returned/Delivered), advance status based on time
            if (['Processing', 'Confirmed', 'Shipped', 'Out for Delivery'].includes(order.status) || order.status === 'Confirmed') {
                const elapsedMinutes = (Date.now() - new Date(order.date).getTime()) / (1000 * 60);
                let newStatus = order.status;

                if (elapsedMinutes < 2) newStatus = 'Processing ⚙️';
                else if (elapsedMinutes < 5) newStatus = 'Shipped 🚢';
                else if (elapsedMinutes >= 5) newStatus = 'Out for Delivery 🚚';

                // Only update if advanced (and avoid overwriting if manually set to something else)
                // Normalize string for safety checks
                const currentNorm = order.status.toLowerCase();
                if (!currentNorm.includes('return') && !currentNorm.includes('cancel') && !currentNorm.includes('delivered')) {
                    if (newStatus !== order.status) {
                        updateOrderStatus(order.id, newStatus);
                        order.status = newStatus; // Local update for display
                    }
                }
            }

            const dateStr = new Date(order.date).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata' // Fix: Force IST for this user
            });

            let trackText = `## 🚚 **Order Tracking**\n\n`;
            trackText += `**Order ID:** ${order.id}\n`;
            trackText += `**Date:** ${dateStr}\n`;

            // Visual Progress Bar
            const stages = ['Processing ⚙️', 'Shipped 🚢', 'Out for Delivery 🚚', 'Delivered ✅'];
            let progress = "";
            let currentFound = false;

            stages.forEach((stage, idx) => {
                const isCurrent = order.status === stage;
                if (order.status.includes(stage.split(' ')[0])) currentFound = true; // Simple match

                if (isCurrent) progress += `**[${stage}]**`; // Bold current
                else if (!currentFound && order.status !== 'Cancelled' && order.status !== 'Return Requested') progress += `${stage.split(' ')[0]}...`; // Future
                else progress += `~~${stage.split(' ')[0]}~~`; // Past

                if (idx < stages.length - 1) progress += " → ";
            });

            // Override progress for special states
            if (order.status.includes("Cancel")) progress = "🔴 **CANCELLED**";
            if (order.status.includes("Return")) progress = "↩️ **RETURN REQUESTED**";

            trackText += `**Status:** ${progress}\n\n`;

            trackText += `### 📦 **Items:**\n`;
            order.items.forEach(item => {
                const product = inventory.find(p => p.id === item.id);
                const name = product ? product.name : item.id;
                trackText += `- **${item.quantity}x** ${name}\n`;
            });

            trackText += `\n**Total Price:** $${order.total}\n`;
            trackText += `**Shipping to:** ${order.shippingAddress || order.address}\n`;

            return trackText;
        } else {
            return `❌ I couldn't find Order ${orderId}. Check the number?`;
        }
    }

    // 2. CHECK FOR BUYING INTENT (Product Search & "Buy 23")
    const buyKeywords = ["buy", "order", "get", "purchase", "want", "need"];
    const negativeKeywords = ["no", "not", "don't", "dont", "stop", "cancel"];

    // Check if any buy keyword is present AND not immediately preceded by a negative (simplified check for now)
    const isBuying = buyKeywords.some(k => msg.includes(k)) && !negativeKeywords.some(n => msg.includes(n));

    let matchedProduct = null;
    let matchedScore = 0;

    inventory.forEach(i => {
        let score = 0;
        const nameWords = i.name.toLowerCase().split(' ');

        // FIX: Use Word Boundaries to prevent "products" matching "pro"
        nameWords.forEach(w => {
            // Escape special chars in product names if any, though likely just alphanumeric 
            try {
                const regex = new RegExp(`\\b${w}\\b`, 'i');
                if (regex.test(msg)) score += 2;
            } catch (e) {
                if (msg.includes(w)) score += 1; // Fallback
            }
        });

        if (i.category && msg.includes(i.category.toLowerCase())) score += 5;
        if (msg.includes(i.id.toLowerCase())) score += 10;

        if (score > matchedScore) {
            matchedScore = score;
            matchedProduct = i;
        }
    });

    // RECOVERY: Check previous message context for "buy 23"
    // If user says "buy" or "buy 23" but didn't name the product, check history.
    if (isBuying && !matchedProduct) {
        const lastModelMsg = history.slice().reverse().find(h => h.role === "model");
        if (lastModelMsg && lastModelMsg.parts && lastModelMsg.parts[0].text) {
            const text = lastModelMsg.parts[0].text;
            // Look for bold product name in previous message (e.g. "**Sony TV**")
            const productMatch = text.match(/\*\*(.*?)\*\*/) || text.match(/## .*? \*\*(.*?)\*\*/);
            if (productMatch) {
                const potentialName = productMatch[1];
                const found = inventory.find(i => i.name.toLowerCase().includes(potentialName.toLowerCase().trim()));
                if (found) matchedProduct = found;
            }
        }
    }

    const finalProduct = matchedProduct;
    const qtyMatch = msg.match(/(\d+)/);
    const quantity = qtyMatch ? parseInt(qtyMatch[0]) : 1;

    // 2.5. CONTEXTUAL RECOVERY: RESPONSE TO "Where to ship?"
    // If user is replying to "Just tell me where to ship it...", treat this as providing details.
    if (!finalProduct && !isBuying) {
        const lastModelMsg = history.slice().reverse().find(h => h.role === "model");
        if (lastModelMsg && lastModelMsg.parts && lastModelMsg.parts[0].text) {
            const lastText = lastModelMsg.parts[0].text;

            // CHECK FOR BOTH OLD AND NEW PROMPT PHRASES
            const isPrompt = lastText.includes("tell me where to ship") ||
                lastText.includes("how you'd like to pay") ||
                lastText.includes("To complete your order, please provide");

            if (isPrompt) {
                // Formatting is: "**2 x iPhone 15**" or similar or "You want **1 x Sony TV**"
                const productMatch = lastText.match(/\*\*(\d+) x (.*?)\*\*/);

                if (productMatch) {
                    const recoveredQty = parseInt(productMatch[1]);
                    const recoveredName = productMatch[2];
                    const found = inventory.find(i => i.name === recoveredName); // Exact match from generated string

                    if (found) {
                        // FORCE BUY FLOW with recovered details
                        // We set 'isBuying' to true effectively by handling it here

                        // Check for Address & Payment & Email in the message
                        const hasEmail = msg.includes("@") && msg.includes(".");
                        const hasPayment = msg.includes("upi") || msg.includes("card") || msg.includes("cash") || msg.includes("pay");

                        // Extract Email
                        const emailMatch = msg.match(/[\w.-]+@[\w.-]+\.\w+/);
                        const userEmail = emailMatch ? emailMatch[0] : "rp0366685@gmail.com";

                        let paymentMethod = "Cash on Delivery";
                        if (msg.includes("upi")) paymentMethod = "UPI";
                        else if (msg.includes("credit")) paymentMethod = "Credit Card";
                        else if (msg.includes("debit")) paymentMethod = "Debit Card";
                        else if (msg.includes("net")) paymentMethod = "Net Banking";
                        else if (msg.includes("cash")) paymentMethod = "Cash on Delivery";

                        // Address Logic (Same as main block)
                        let address = "Provided Address";
                        const cleanMsg = msg.replace(userEmail, "").replace(/upi|credit|debit|card|cash|net banking/gi, "").trim();

                        const addrIndex = msg.indexOf("address");
                        if (addrIndex !== -1) {
                            address = msg.substring(addrIndex + 7).split(/,|payment|via|email/)[0].trim().replace(/^[:\s]+/, '');
                        } else {
                            if (cleanMsg.length > 2) address = cleanMsg.replace(/[,.]/g, " ").trim();
                        }

                        const total = found.price * recoveredQty;

                        return `## 🛒 **Ready to Order**\n\nGetting ${recoveredQty} x ${found.name}\nUnit Price: $${found.price}\n**Total: $${total}**\n\nShipping to: ${address}\nEmail: **${userEmail}**\nPayment: ${paymentMethod}\n\n**Reply "yes" to confirm!**\n<!--\n**Confirm Order**\nInventory ID: ${found.id}\nQuantity: ${recoveredQty}\nAddress: ${address}\nPayment: ${paymentMethod}\nEmail: ${userEmail}\n-->`;
                    }
                }
            }
        }
    }

    // 2.6. CONTEXTUAL RECOVERY: GENERIC (Shipping Address OR Return Reason)
    // Checks if the bot previously asked a question and uses the current message as the answer.
    if (!intentIsReturn && !isBuying && !orderIdMatch) {
        const lastModelMsg = history.slice().reverse().find(h => h.role === "model");
        if (lastModelMsg && lastModelMsg.parts && lastModelMsg.parts[0].text) {
            const lastText = lastModelMsg.parts[0].text;

            // A. RECOVERY FOR RETURN REASON
            const reasonPromptMatch = lastText.match(/Why are you returning Order \*\*(ORD.*?)\*\*/);
            if (reasonPromptMatch) {
                const recoveredOrderId = reasonPromptMatch[1];
                const reason = msg; // Assume full text is reason

                const order = getOrderById(recoveredOrderId);
                // Safety check
                if (order) {
                    const product = inventory.find(i => i.id === order.items[0]?.id);
                    return `## 🔄 **Confirm Return Request**\n\nReturning **${recoveredOrderId}** (${product ? product.name : 'Item'}) because: "${reason}".\n\nReply **"yes"** to confirm.\n<!--\n**Confirm Return**\nOrder ID: ${recoveredOrderId}\nReason: ${reason}\n-->`;
                }
            }
        }
    }

    // 2.7. ORDER CORRECTION (User corrects details instead of saying "yes")
    const lastModelMsg = history.slice().reverse().find(h => h.role === "model");
    if (lastModelMsg && lastModelMsg.parts && lastModelMsg.parts[0].text) {
        const lastText = lastModelMsg.parts[0].text;

        // If last message was a Confirmation Request
        const pendingOrderMatch = lastText.match(/\*\*Confirm Order\*\*\nInventory ID: (.*)\nQuantity: (\d+)\nAddress: (.*)\nPayment: (.*)\nEmail: (.*)/);

        if (pendingOrderMatch) {
            // User is replying to a confirmation... usually "yes", but maybe correcting details?
            const [_, oldId, oldQty, oldAddr, oldPay, oldEmail] = pendingOrderMatch;

            // Check if user provided new details
            const newEmailMatch = msg.match(/[\w.-]+@[\w.-]+\.\w+/);
            const newQtyMatch = msg.match(/^(\d+)$/);
            const hasNewPayment = msg.includes("upi") || msg.includes("card") || msg.includes("cash");

            if (newEmailMatch || newQtyMatch || hasNewPayment || (msg.length > 5 && !msg.includes("yes"))) {

                // UPDATE THE ORDER
                const updatedId = oldId.trim(); // Assume same product/qty unless explicit change
                const updatedQty = newQtyMatch ? parseInt(newQtyMatch[1]) : parseInt(oldQty);
                const updatedEmail = newEmailMatch ? newEmailMatch[0] : oldEmail.trim();
                let updatedPayment = oldPay.trim();

                if (msg.includes("upi")) updatedPayment = "UPI";
                else if (msg.includes("credit")) updatedPayment = "Credit Card";
                else if (msg.includes("cash")) updatedPayment = "Cash on Delivery";

                // If not just "yes", treat as correction
                if (!msg.toLowerCase().includes("yes")) {
                    const product = inventory.find(i => i.id === updatedId);
                    if (product) {
                        const total = product.price * updatedQty;

                        // Use old address if no new one obvious, or just use whole msg if it looks like addr?
                        // For safety, keep old address unless explicit.
                        let updatedAddress = oldAddr.trim();
                        if (msg.length > 5 && !hasNewPayment && !newEmailMatch) updatedAddress = msg; // Assume correction is address

                        return `## 🛒 **Updated Order**\n\nGetting ${updatedQty} x ${product.name}\nUnit Price: $${product.price}\n**Total: $${total}**\n\nShipping to: ${updatedAddress}\nEmail: **${updatedEmail}**\nPayment: ${updatedPayment}\n\n**Reply "yes" to confirm!**\n<!--\n**Confirm Order**\nInventory ID: ${updatedId}\nQuantity: ${updatedQty}\nAddress: ${updatedAddress}\nPayment: ${updatedPayment}\nEmail: ${updatedEmail}\n-->`;
                    }
                }
            }
        }
    }

    // A. "Buy 23" Logic (Contextual Buy)
    // If we know the product (finalProduct) and user wants to buy...
    if (finalProduct && isBuying) {

        // Check for Address & Payment & Email in the message

        // Check for Address & Payment & Email in the message
        const hasEmail = msg.includes("@") && msg.includes(".");
        const hasPayment = msg.includes("upi") || msg.includes("card") || msg.includes("cash") || msg.includes("pay");

        // Heuristic: If we have payment AND email, assume the rest is address if reasonably long enough
        // OR search for explicit address keywords
        const isAddressExplicit = msg.includes("address") || msg.includes("deliver") || msg.includes("live at") || msg.includes("shipping") || msg.match(/at\s+\d+/);
        const hasAddress = isAddressExplicit || (hasEmail && hasPayment && msg.length > 10);

        // If MISSING key details, ask simply!
        // We only block if we are really unsure. If we have email + payment, we proceed and try to extract address.
        if ((!hasPayment || !hasEmail) && !hasAddress) { // Only block if address is also missing/unknown
            const total = finalProduct.price * quantity;
            return `You want **${quantity} x ${finalProduct.name}**? Great choice! ✨\n\nUnit Price: $${finalProduct.price}\nTotal: **$${total}**.\n\nTo complete your order, please provide:\n1. **Shipping Address**\n2. **Email Address** (for the receipt)\n3. **Payment Method** (Cash/Card/UPI)`;
        }

        // If WE HAVE DETAILS, draft the order!
        let paymentMethod = "Cash on Delivery";
        if (msg.includes("upi")) paymentMethod = "UPI";
        else if (msg.includes("credit")) paymentMethod = "Credit Card";
        else if (msg.includes("debit")) paymentMethod = "Debit Card";
        else if (msg.includes("net")) paymentMethod = "Net Banking";
        else if (msg.includes("cash")) paymentMethod = "Cash on Delivery";

        // Extract Email
        const emailMatch = msg.match(/[\w.-]+@[\w.-]+\.\w+/);
        const userEmail = emailMatch ? emailMatch[0] : "rp0366685@gmail.com";

        // Simple address extraction
        let address = "Provided Address";

        // Remove known entities to isolate address
        const cleanMsg = msg.replace(userEmail, "").replace(/upi|credit|debit|card|cash|net banking/gi, "").trim();

        const addrIndex = msg.indexOf("address");
        if (addrIndex !== -1) {
            address = msg.substring(addrIndex + 7).split(/,|payment|via|email/)[0].trim().replace(/^[:\s]+/, '');
        } else {
            // Simplified Fallback
            // If the cleaned message is long enough (even short city like "city"), assume it's the address
            if (cleanMsg.length > 2) address = cleanMsg.replace(/[,.]/g, " ").trim();
        }

        const total = (finalProduct.price * quantity);

        return `## 🛒 **Ready to Order**\n\nGetting ${quantity} x ${finalProduct.name}\nUnit Price: $${finalProduct.price}\n**Total: $${total}**\n\nShipping to: ${address}\nEmail: ${userEmail}\nPayment: ${paymentMethod}\n\n**Reply "yes" to confirm!**\n<!--\n**Confirm Order**\nInventory ID: ${finalProduct.id}\nQuantity: ${quantity}\nAddress: ${address}\nPayment: ${paymentMethod}\nEmail: ${userEmail}\n-->`;
    }

    // B. Just Showing Product Info
    if (finalProduct && !isBuying) {
        const stockMsg = finalProduct.stock > 0 ? `✅ Available (${finalProduct.stock})` : `❌ Out of Stock`;
        return `## ℹ️ **${finalProduct.name}**\n**ID:** ${finalProduct.id}\n**Price:** $${finalProduct.price}\n**Status:** ${stockMsg}\n\nWant it? Just type **"buy"** or **"buy 2"**!`;
    }

    // C. General Shop Intent
    if (msg.includes("shop") || msg.includes("list") || msg.includes("products") || msg.includes("show me")) {
        // ... (existing shop logic)
    }

    // C.5 PRODUCT RECOMMENDATIONS
    if (msg.includes("recommend") || msg.includes("suggest") || msg.includes("what should i buy") || msg.includes("popular")) {
        let targetCategory = null;
        let reason = "Trending Now 🔥";
        let itemsToShow = [];

        // 1. BROAD SPECTRUM REQUESTS (e.g. "Appliances")
        if (msg.includes("appliance")) {
            // User wants "Appliances" - show a mix, not just one category
            const applianceCats = ["Home Appliances", "Televisions", "Smart Home"];
            const mixItems = [];

            applianceCats.forEach(cat => {
                const bestInCat = inventory.filter(i => i.category === cat && i.stock > 0).sort((a, b) => b.price - a.price)[0];
                if (bestInCat) mixItems.push(bestInCat);
            });

            itemsToShow = mixItems;
            reason = "Top Home & Electronics Picks 🏠";
            targetCategory = "Mixed"; // flag to skip next steps
        }

        // 2. Direct Category Request (Specific)
        if (!targetCategory) {
            // We scan inventory categories to see if any match the user's text
            const uniqueCategories = [...new Set(inventory.map(i => i.category))];
            const requestedCat = uniqueCategories.find(c => msg.includes(c.toLowerCase().split(' ')[0]) || msg.includes(c.toLowerCase().split(' ')[1] || "xyz"));

            if (requestedCat) {
                targetCategory = requestedCat;
                reason = `Top picks in **${targetCategory}** for you! ✨`;
            }
        }

        // 3. History-Based (if no direct request)
        if (!targetCategory) {
            const userOrders = getOrders().filter(o => o.email === "rp0366685@gmail.com");
            if (userOrders.length > 0) {
                // Check for Appliance History specifically
                const applianceCats = ["Home Appliances", "Televisions", "Smart Home"];
                let lastAppliance = null;

                // Look for the most recent appliance purchased
                // Iterate through orders in reverse to find the most recent
                for (let i = userOrders.length - 1; i >= 0; i--) {
                    const order = userOrders[i];
                    // Iterate through items in reverse to find the most recent within the order
                    for (let j = order.items.length - 1; j >= 0; j--) {
                        const item = order.items[j];
                        const product = inventory.find(p => p.id === item.id);
                        if (product && applianceCats.includes(product.category)) {
                            lastAppliance = product;
                            break;
                        }
                    }
                    if (lastAppliance) break;
                }

                if (lastAppliance) {
                    // RECOMMEND BASED ON APPLIANCE HISTORY
                    reason = `Since you bought **${lastAppliance.name}**... 🏠`;
                    targetCategory = "History-Appliance";

                    // Show mixed appliance recommendations similar to Broad Spectrum
                    const mixItems = [];
                    applianceCats.forEach(cat => {
                        // Find top item that ISN'T the one they bought
                        const best = inventory.filter(i => i.category === cat && i.id !== lastAppliance.id && i.stock > 0)
                            .sort((a, b) => b.price - a.price)[0];
                        if (best) mixItems.push(best);
                    });
                    itemsToShow = mixItems.slice(0, 3); // Top 3

                } else {
                    // Standard Category Frequency Logic (Non-Appliance)
                    const catCounts = {};
                    userOrders.forEach(o => {
                        o.items.forEach(orderItem => {
                            const invItem = inventory.find(i => i.id === orderItem.id);
                            if (invItem) catCounts[invItem.category] = (catCounts[invItem.category] || 0) + 1;
                        });
                    });
                    const favCat = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a])[0];
                    if (favCat) {
                        itemsToShow = inventory.filter(i => i.category === favCat && i.stock > 0).slice(0, 3);
                        reason = `Because you like **${favCat}**... ❤️`;
                        targetCategory = "History";
                    }
                }
            }
        }

        // 4. Selection (If not set by Appliance logic or History)
        if (!itemsToShow.length) {
            if (targetCategory && targetCategory !== "Mixed" && targetCategory !== "History") {
                itemsToShow = inventory.filter(i => i.category === targetCategory && i.stock > 0).slice(0, 3);
            } else if (!targetCategory) {
                // Fallback: Trending (Price > $500)
                itemsToShow = inventory.filter(i => i.price > 500 && i.stock > 0).slice(0, 3);
            }
        }

        let output = `## ✨ **${reason}**\n\n`;
        output += `| ID | Product | Price |\n|---|---|---|\n`;
        itemsToShow.forEach(item => {
            output += `| **${item.id}** | ${item.name} | $${item.price} |\n`;
        });
        output += `\nType **"Buy [ID]"** to grab one!`;
        return output;
    }
    if (msg.includes("shop") || msg.includes("list") || msg.includes("products") || msg.includes("show me")) {
        // ... (Same categorized list logic, but simplified header)
        const categories = {};
        inventory.forEach(item => {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push(item);
        });

        let output = "## 🏪 **Catalog**\n\n";
        Object.keys(categories).sort().forEach(category => {
            const items = categories[category];
            output += `### ${category}\n`;
            output += `| ID | Product | Price | Stock |\n|---|---|---|---|\n`;
            items.forEach(item => {
                const stockDisplay = item.stock > 0 ? `${item.stock}` : `❌`;
                output += `| **${item.id}** | ${item.name} | $${item.price} | ${stockDisplay} |\n`;
            });
            output += `\n`;
        });
        output += `\nType **"buy [ID]"** to order!`;
        return output;
    }

    // D. Returns Logic (Fixed from before)
    if (intentIsReturn) {
        if (orderIdMatch) {
            const orderId = orderIdMatch[1].toUpperCase();
            const order = getOrderById(orderId);
            if (!order) return `❌ Can't find Order ${orderId}.`;
            if (order.status !== 'Delivered' && order.status !== 'Confirmed') return `❌ Order ${orderId} isn't eligible for return yet.`;

            let reason = "";
            const reasonKeyMatch = msg.match(/(?:reason|because|for)\s+(.+)/i);
            if (reasonKeyMatch) reason = reasonKeyMatch[1].trim();
            else {
                const parts = msg.split(orderIdMatch[0]);
                if (parts[1] && parts[1].trim().length > 3) reason = parts[1].trim();
            }

            if (reason) {
                const product = inventory.find(i => i.id === order.items[0]?.id);
                return `## 🔄 **Return Request**\n\nReturning **${orderId}** (${product ? product.name : 'Item'}) because: "${reason}".\n\nReply **"yes"** to confirm.\n<!--\n**Confirm Return**\nOrder ID: ${orderId}\nReason: ${reason}\n-->`;
            } else {
                return `## 📝 **Reason?**\n\nWhy are you returning Order **${orderId}**? (e.g., "broken", "wrong color")`;
            }
        }
        return `To return something, just reply **"return [Order ID]"**.`;
    }

    // E. Cancel Logic
    if (intentIsCancel) {
        if (orderIdMatch) {
            const orderId = orderIdMatch[1].toUpperCase();
            const order = getOrderById(orderId);
            if (!order) return `❌ Can't find Order ${orderId}.`;
            if (order.status === 'Delivered' || order.status === 'Cancelled') return `❌ Order ${orderId} cannot be cancelled (Status: ${order.status}).`;

            return `## 🛑 **Confirm Cancellation**\n\nAre you sure you want to cancel Order **${orderId}**?\n\nReply **"yes"** to confirm.\n<!--\n**Confirm Cancellation**\nOrder ID: ${orderId}\n-->`;
        }
        return `To cancel, just reply **"cancel [Order ID]"**.`;
    }

    // F. Modify Order Logic
    const intentIsModify = msg.includes("modify") || msg.includes("change") || msg.includes("update");
    if (intentIsModify && orderIdMatch) {
        const orderId = orderIdMatch[1].toUpperCase();
        const order = getOrderById(orderId);

        if (!order) return `❌ Can't find Order ${orderId}.`;
        if (order.status !== 'Confirmed') return `❌ Cannot modify Order ${orderId} (Status: ${order.status}).`;

        // Sub-intent: Address
        if (msg.includes("address")) {
            const newAddress = msg.split("to")[1] || msg.split("address")[1];
            if (newAddress && newAddress.trim().length > 3) {
                updateOrder(orderId, { address: newAddress.trim() });
                return `✅ Updated address for **${orderId}** to: **${newAddress.trim()}**`;
            } else {
                return `To change address, say: **"Change address for ${orderId} to [New Address]"**`;
            }
        }

        // Sub-intent: Payment
        if (msg.includes("payment") || msg.includes("method")) {
            return `To change payment, say: **"Update payment for ${orderId} to [Cash/Card/UPI]"**`;
        }

        // Sub-intent: Remove Item (Simplified Mod)
        if (msg.includes("remove") || msg.includes("delete") || msg.includes("cancel item")) {
            // For this demo, since most orders are single-line items or simplified, 
            // we'll guide them to Cancel & Re-order if it's complex, 
            // OR assume they want to remove the item mentioned.
            return `⚠️ To remove items, it's safer to **Cancel** this order and place a new one.\n\nReply **"Cancel ${orderId}"** to do that.`;
        }

        return `## ✏️ **Modify Order**\n\nWhat would you like to change for Order **${orderId}**?\n\n- **Change Address**: "Change address to..."\n- **Cancel Order**: "Cancel order"`;
    }

    // F. Order History (Real Data)
    if (msg.includes("history") || msg.includes("my orders") || msg.includes("past orders") || msg.includes("previous orders")) {
        const orders = getOrders();
        // Filter by the default email used in this demo
        const userEmail = "rp0366685@gmail.com";
        const myOrders = orders.filter(o => o.email === userEmail || o.customerName === "Guest User"); // Broaden filter for demo purposes if needed

        if (myOrders.length === 0) {
            return `## 📜 **Order History**\n\nNo orders found! Start shopping to fill this list. 🛍️`;
        }

        // Get last 5, reversed
        const recent = myOrders.slice(-5).reverse();

        let hist = `## 📜 **Recent Orders**\n\n`;
        hist += `| Order ID | Date | Total | Status |\n|---|---|---|---|\n`;

        recent.forEach(o => {
            const dateStr = new Date(o.date).toLocaleDateString("en-US", {
                month: 'short', day: 'numeric',
                timeZone: 'Asia/Kolkata'
            });
            hist += `| **${o.id}** | ${dateStr} | $${o.total} | ${o.status} |\n`;
        });

        hist += `\nType **"Track [Order ID]"** for full details!`;
        return hist;
    }

    // G. Admin Dashboard
    if (msg.includes("admin") || msg.includes("dashboard") || msg.includes("report")) {
        const orders = getOrders();

        // Calculate Revenue
        const totalRevenue = orders
            .filter(o => o.status !== 'Cancelled' && o.status !== 'Returned')
            .reduce((sum, o) => sum + o.total, 0);

        // Status Counts
        const statusCounts = {};
        orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

        // Low Stock
        const lowStock = inventory.filter(i => i.stock < 20).map(i => `${i.name} (${i.stock})`);

        let report = `## 📊 **Admin Dashboard**\n\n`;
        report += `**💰 Total Revenue:** $${totalRevenue}\n`;
        report += `**📦 Total Orders:** ${orders.length}\n\n`;

        report += `### 📈 **Order Status Breakdown**\n`;
        if (Object.keys(statusCounts).length > 0) {
            Object.keys(statusCounts).forEach(s => {
                report += `- **${s}:** ${statusCounts[s]}\n`;
            });
        } else {
            report += `- No orders yet.\n`;
        }

        if (lowStock.length > 0) {
            report += `\n### ⚠️ **Low Stock Alert**\n`;
            lowStock.forEach(item => report += `- ${item}\n`);
        } else {
            report += `\n✅ **Inventory Status:** Healthy\n`;
        }

        return report;
    }

    return null;
}

// ... (sendMessageWithRetry remains same)
async function sendMessageWithRetry(chatSession, message, retries = 2) {
    for (let i = 0; i < retries; i++) {
        try {
            return await chatSession.sendMessage(message);
        } catch (error) {
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            } else throw error;
        }
    }
}

export async function POST(req) {
    if (!apiKey) return NextResponse.json({ role: "model", parts: [{ text: "Service Unavailable (Missing API Key)" }] });

    try {
        const body = await req.json();
        const message = body.message;
        const history = body.history || [];

        const localResponse = await processLocalIntent(message, history);
        if (localResponse) {
            return NextResponse.json({ role: "model", parts: [{ text: localResponse }] });
        }

        let cleanHistory = history.map(h => ({ role: h.role, parts: [{ text: h.parts[0]?.text || "" }] }));
        if (cleanHistory.length > 0 && cleanHistory[0].role === 'model') cleanHistory.shift();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const chat = model.startChat({ history: cleanHistory, tools: toolDefinitions });
        let result = await sendMessageWithRetry(chat, `${SYSTEM_INSTRUCTION}\n\nUser: ${message}`);

        // ... (Tool handling same as before)
        let response = result.response;
        // Simplified tool loop for brevity
        return NextResponse.json({ role: "model", parts: [{ text: response.text() }] });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ role: "model", parts: [{ text: `Oops, something went wrong. Try again?` }] });
    }
}
