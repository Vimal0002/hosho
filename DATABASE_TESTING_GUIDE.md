# 🧪 Database Testing Commands

## ✅ **Quick Test Command:**

### **Test SQLite Connection:**
```bash
node test-sqlite.js
```

**What it shows:**
- ✅ Database file location
- ✅ Number of products
- ✅ Number of orders
- ✅ Sample products
- ✅ Connection status

---

## 📊 **Expected Output:**

```
📦 SQLite database: C:\Users\hp\hosho\electrominds.db
🔍 Testing SQLite Connection...

✅ Inventory Table: 57 products
✅ Orders Table: 1 orders
✅ Order Items Table: 1 items

📦 Sample Products:
   TV001: Sony Bravia 55" 4K TV - $600 (50 in stock)
   TV002: Samsung 65" QLED TV - $900 (60 in stock)
   TV003: LG OLED 55" TV - $1200 (45 in stock)
   TV004: TCL 43" Smart TV - $350 (80 in stock)
   TV005: Hisense 50" 4K TV - $450 (70 in stock)

✅ SQLite is CONNECTED and WORKING!
📦 Database file: electrominds.db
🚀 Your app is ready!
```

---

## 🔍 **Other Testing Commands:**

### **1. Check if Database File Exists:**
```bash
Test-Path electrominds.db
```
**Expected:** `True`

---

### **2. Check Database File Size:**
```bash
Get-Item electrominds.db | Select-Object Name, Length
```
**Expected:** Shows file size (~100KB)

---

### **3. Reinitialize Database (if needed):**
```bash
node scripts/init-sqlite.js
```
**What it does:**
- Creates tables
- Migrates data from database.json
- Shows migration results

---

### **4. Start Your App:**
```bash
npm run dev
```
**Expected:** Server starts at http://localhost:3000

---

## 📋 **Quick Reference:**

| Command | Purpose |
|---------|---------|
| `node test-sqlite.js` | Test database connection |
| `Test-Path electrominds.db` | Check if DB file exists |
| `node scripts/init-sqlite.js` | Reinitialize database |
| `npm run dev` | Start your app |

---

## ✅ **Connection Status Indicators:**

### **✅ Connected:**
```
✅ Inventory Table: 57 products
✅ Orders Table: X orders
✅ SQLite is CONNECTED and WORKING!
```

### **❌ Not Connected:**
```
❌ Error: Cannot find module
❌ Error: SQLITE_CANTOPEN
❌ Error: no such table
```

---

## 🔧 **Troubleshooting:**

### **If test fails:**

**1. Check if database file exists:**
```bash
Test-Path electrominds.db
```

**2. If False, reinitialize:**
```bash
node scripts/init-sqlite.js
```

**3. Test again:**
```bash
node test-sqlite.js
```

---

## 📊 **Advanced Testing:**

### **Count All Products:**
```bash
node -e "const {db} = require('./lib/db-sqlite'); console.log('Products:', db.prepare('SELECT COUNT(*) as count FROM inventory').get().count)"
```

### **List All Tables:**
```bash
node -e "const {db} = require('./lib/db-sqlite'); console.log(db.prepare('SELECT name FROM sqlite_master WHERE type=\"table\"').all())"
```

### **Show First 10 Products:**
```bash
node -e "const {db} = require('./lib/db-sqlite'); db.prepare('SELECT name, price FROM inventory LIMIT 10').all().forEach(p => console.log(p.name, '-', p.price))"
```

---

## 🎯 **Daily Testing Routine:**

### **Before starting work:**
```bash
# 1. Test database
node test-sqlite.js

# 2. Start app
npm run dev
```

### **After making changes:**
```bash
# 1. Test database
node test-sqlite.js

# 2. Restart app
# Stop with Ctrl+C, then:
npm run dev
```

---

## 📁 **Test Files:**

| File | Purpose |
|------|---------|
| `test-sqlite.js` | Main test script |
| `scripts/init-sqlite.js` | Database initialization |
| `electrominds.db` | Your database file |

---

## ✅ **What to Check:**

1. ✅ **Database file exists** - `electrominds.db`
2. ✅ **Products loaded** - Should show 57 products
3. ✅ **Tables created** - 5 tables (inventory, orders, order_items, returns, feedback)
4. ✅ **Connection working** - Test script runs without errors
5. ✅ **App starts** - `npm run dev` works

---

## 🚀 **Quick Test:**

**One command to test everything:**
```bash
node test-sqlite.js && echo "✅ Database OK!" || echo "❌ Database Error!"
```

---

## 📊 **Your Current Status:**

```
✅ Database File: electrominds.db
✅ Products: 57 items
✅ Orders: 1 order
✅ Connection: Working
✅ Status: READY
```

---

**Main Test Command:** `node test-sqlite.js`

**Use this anytime to check your database!** 🧪
