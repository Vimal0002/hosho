require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db, initializeDatabase } = require('./database');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Routes

// 1. Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 2. Search products
app.get('/api/products/search', (req, res) => {
  const searchTerm = req.query.q || '';
  const query = `
    SELECT * FROM products 
    WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
    LIMIT 10
  `;
  const params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 3. Get products by category
app.get('/api/products/category/:category', (req, res) => {
  db.all('SELECT * FROM products WHERE category = ?', [req.params.category], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 4. Chat endpoint with AI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get conversation history (last 5 messages)
    const history = await new Promise((resolve, reject) => {
      db.all(
        `SELECT role, message FROM conversations 
         WHERE user_id = ? OR user_id IS NULL 
         ORDER BY created_at DESC LIMIT 10`,
        [userId || null],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows.reverse());
        }
      );
    });

    // Get products for context
    const products = await new Promise((resolve, reject) => {
      db.all('SELECT id, name, price, category, description FROM products LIMIT 8', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Build system prompt
    const systemPrompt = `You are a helpful AI assistant for an electronics store. You help customers browse products, find recommendations, and place orders.

Available products:
${products.map(p => `- ${p.name} ($${p.price}): ${p.description} - Category: ${p.category}`).join('\n')}

When customers ask about products:
1. Recommend relevant products based on their needs
2. Provide prices and specifications
3. Help them add items to cart or place orders
4. Answer questions about electronics

Be conversational, helpful, and focused on electronics.`;

    // Prepare messages for OpenAI
    const messages = [
      ...history.map(h => ({
        role: h.role,
        content: h.message
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0].message.content;

    // Save conversation to database
    if (userId) {
      db.run('INSERT INTO conversations (user_id, role, message) VALUES (?, ?, ?)',
        [userId, 'user', message]);
      db.run('INSERT INTO conversations (user_id, role, message) VALUES (?, ?, ?)',
        [userId, 'assistant', assistantMessage]);
    }

    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Add to cart
app.post('/api/cart/add', (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: 'userId and productId are required' });
  }

  db.run(
    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [userId, productId, quantity || 1],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, cartId: this.lastID });
    }
  );
});

// 6. Get cart
app.get('/api/cart/:userId', (req, res) => {
  const query = `
    SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  
  db.all(query, [req.params.userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 7. Create order
app.post('/api/orders', (req, res) => {
  const { userId, cartItems } = req.body;

  if (!userId || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'userId and cartItems are required' });
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  db.run(
    'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
    [userId, totalPrice, 'pending'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const orderId = this.lastID;

      // Insert order items
      cartItems.forEach(item => {
        db.run(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );
      });

      // Clear cart
      db.run('DELETE FROM cart WHERE user_id = ?', [userId]);

      res.json({ success: true, orderId, totalPrice });
    }
  );
});

// 8. Get orders
app.get('/api/orders/:userId', (req, res) => {
  db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
