# Quick Reference Guide - ElectroMinds AI Assistant

## 🎯 New Features Quick Guide

### 💳 Payment Methods (NEW!)

**Available Payment Options:**
- UPI
- Net Banking  
- Credit Card
- Debit Card
- Cash on Delivery

**How to Order:**
```
buy [product], [quantity], [address], [payment method]

Examples:
✅ buy iphone 15, 1, 123 main street, upi
✅ buy samsung tv, 2, downtown plaza, credit card
✅ buy macbook, 1, tech park, net banking
✅ buy airpods, 3, home address, cash on delivery
```

**What You'll See:**
```
order confirmed serial number ORD1737699234567 
item iPhone 15 
qty 1 
total 999 
shipping to 123 main street 
payment via UPI 
receipt sent to email 
thanks for shopping
```

---

### 🔄 Easy Returns (IMPROVED!)

**Method 1: Direct Return**
```
return ORD1737699234567
```

**Method 2: Return with Reason**
```
return ORD1737699234567 reason defective screen
```

**Method 3: See Returnable Orders**
```
return
```
Bot will show:
```
to return an order provide order id example return ORD123456

your recent orders
ORD1737699234567 PH001 status Delivered
ORD1737699123456 TV001 status Confirmed
```

**Return Confirmation:**
```
return request submitted for order ORD1737699234567 
ticket id RET1737699999999 
status Pending Approval 
we will process your return within 2-3 business days
```

---

### 📦 Track Orders

**Simple Tracking:**
```
track order
```

**What You'll See:**
```
tracking 2 recent orders

order id ORD1737699234567
status Confirmed
placed on 1/24/2026
payment method UPI
shipping to 123 main street
total 999
items
  iPhone 15 qty 1
```

**Track Specific Order:**
```
track ORD1737699234567
```

---

### 🛍️ Shopping Flow

**1. Browse Products:**
```
list products
show me products
what do you have
```

**2. Check Product:**
```
iphone 15
samsung tv
macbook air
```

**3. Place Order:**
```
buy [product], [qty], [address], [payment]
```

**4. Confirm:**
```
yes
confirm
ok
```

---

### 📋 Order History

**View History:**
```
history
my orders
past orders
```

**Response:**
```
order history showing 3 recent orders

order id ORD1737699234567
date 1/24/2026
status Confirmed
total 999
items
  PH001 qty 1 in stock 24 remaining
```

---

### ❌ Cancel Orders

**Cancel an Order:**
```
cancel ORD1737699234567
stop order ORD1737699234567
```

---

### 💬 Feedback

**Submit Feedback:**
```
feedback great service
feedback product quality excellent
```

---

### 👨‍💼 Admin Features

**View Stats:**
```
admin report
sales report
stats
```

**Response:**
```
admin report 
total sales 15000 
orders 15 
current inventory
Sony Bravia 55" 4K TV 15
Samsung 65" QLED TV 8
iPhone 15 25
```

---

## 🎨 UI Theme

**Current Theme:** Medium Dark
- Comfortable slate-700/800 colors
- Not too dark, easy on eyes
- Good contrast for readability
- Professional and modern
- Vibrant purple/pink accents

---

## 🚀 Quick Tips

1. **Payment Methods** - Always specify payment method when ordering
2. **Returns** - Just type "return" to see returnable orders
3. **Tracking** - Click "Track Order" button for instant tracking
4. **Order ID** - Always starts with "ORD" followed by numbers
5. **Return Ticket** - Always starts with "RET" followed by numbers

---

## 📱 Button Shortcuts

- **Shop Products** → Lists all available products
- **Track Order** → Shows recent orders with tracking
- **Order History** → Shows past orders with stock status
- **Returns** → Guides you through return process
- **Cancel Order** → Prompts for order ID to cancel
- **Admin Console** → Shows sales and inventory stats

---

## ⚡ Common Commands

| What You Want | What to Type |
|---------------|--------------|
| See products | `list products` |
| Buy something | `buy iphone 15, 1, address, upi` |
| Track orders | `track order` |
| Return item | `return ORD123456` |
| View history | `history` |
| Cancel order | `cancel ORD123456` |
| Give feedback | `feedback great app` |
| Admin stats | `admin report` |

---

## 🎯 Example Conversations

### Complete Purchase:
```
You: list products
Bot: [shows product list]

You: iphone 15
Bot: iPhone 15 is in stock price 999 availability 25 left want to order

You: buy iphone 15, 1, 123 main st, upi
Bot: please confirm item iPhone 15 quantity 1 total 999 address 123 main st payment UPI reply yes to place order

You: yes
Bot: order confirmed serial number ORD1737699234567...
```

### Easy Return:
```
You: return
Bot: [shows recent returnable orders]

You: return ORD1737699234567 reason wrong color
Bot: return request submitted for order ORD1737699234567 ticket id RET1737699999999...
```

### Track Order:
```
You: track order
Bot: tracking 2 recent orders
     [shows full tracking details with payment method]
```

---

**Need Help?** Just type "help" or ask any question!
