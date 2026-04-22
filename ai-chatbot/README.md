# 🤖 AI Electronics Order Chatbot

A full-stack web application that uses AI to help customers browse electronics, get personalized recommendations, and place orders.

## 🎯 Features

- **AI-Powered Chat**: Real-time conversations with OpenAI (GPT-3.5-turbo)
- **Product Catalog**: Browse 8+ electronics products with search
- **Smart Recommendations**: AI recommends products based on customer needs
- **Shopping Cart**: Add/remove products, view cart total
- **Order Management**: Place orders and track order history
- **Conversation History**: Chat history saved to database
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## 🏗️ Architecture

```
Frontend (React + Vite)
        ↓
Backend (Node.js + Express)
        ↓
Database (SQLite)
   ↓
AI (OpenAI API)
```

### Components

- **Backend**: Node.js + Express API server
- **Frontend**: React with Vite (fast dev server)
- **Database**: SQLite3 with 6 tables (users, products, cart, orders, order_items, conversations)
- **AI**: OpenAI Chat Completions API

## 📋 Prerequisites

- Node.js 16+ and npm
- OpenAI API key (get from [openai.com](https://openai.com))

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd ai-chatbot

# Add your OpenAI API key to .env
# Edit .env and replace 'your_openai_api_key_here' with your actual key
nano .env

# Install dependencies (already done if you followed setup)
npm install

# Start the backend server
npm run dev
# Server runs on http://localhost:5000
```

### 2. Setup Frontend (New Terminal)

```bash
cd ai-chatbot/frontend

# Install dependencies
npm install

# Start the React dev server
npm run dev
# Open http://localhost:3000 in your browser
```

## 📦 Database Schema

### Tables

1. **users**: User accounts with email, password, name
2. **products**: Electronics products (name, price, stock, category)
3. **cart**: Shopping cart items linked to users
4. **orders**: Customer orders with status
5. **order_items**: Individual items in each order
6. **conversations**: Chat history with AI

### Sample Data

The database initializes with 8 products:
- Wireless Headphones ($89.99)
- USB-C Cable ($12.99)
- 4K Webcam ($149.99)
- Mechanical Keyboard ($129.99)
- Portable SSD ($99.99)
- Phone Stand ($19.99)
- LED Monitor Light ($39.99)
- Laptop Cooling Pad ($34.99)

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?q=keyword` - Search products
- `GET /api/products/category/:category` - Get by category

### Chat
- `POST /api/chat` - Send message to AI chatbot
  ```json
  {
    "message": "What headphones do you recommend?",
    "userId": 1
  }
  ```

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart/:userId` - Get user's cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:userId` - Get user's orders

### Health
- `GET /api/health` - Server status check

## 🎨 UI Features

### Chat Section
- Real-time message streaming
- Typing indicator animation
- Auto-scroll to latest messages
- Welcome message with feature list

### Sidebar
- **Featured Products**: Browse top 5 products
- **Shopping Cart**: View items and total
- Quick add-to-cart buttons

### Responsive Design
- Desktop: Chat + Sidebar layout
- Mobile: Chat only (sidebar hidden)

## 🔧 Configuration

### Environment Variables (.env)

```env
OPENAI_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
```

### OpenAI Settings

In `server.js`, modify the AI parameters:
```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  max_tokens: 500,
  temperature: 0.7,  // 0-1, higher = more creative
});
```

## 📝 Example Conversations

### User: "I need headphones for gaming"
**AI**: Recommends Wireless Headphones with features and price

### User: "What's the most affordable storage option?"
**AI**: Suggests Portable SSD, shows price and specs

### User: "Add the keyboard to my cart"
**AI**: Confirms addition and suggests related products

## 🛠️ Development

### File Structure

```
ai-chatbot/
├── server.js              # Backend API server
├── database.js            # SQLite schema & initialization
├── package.json           # Backend dependencies
├── .env                   # API keys (don't commit!)
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main React component
    │   ├── App.css        # Styling
    │   └── main.jsx       # React entry point
    ├── index.html         # HTML template
    ├── vite.config.js     # Vite configuration
    └── package.json       # Frontend dependencies
```

### Running Tests

```bash
# Test if backend is running
curl http://localhost:5000/api/health

# Test if frontend is running
curl http://localhost:3000
```

## 🚀 Deployment

### Deploy Backend (Heroku/Railway)

```bash
git push heroku main
# Set environment variables:
heroku config:set OPENAI_API_KEY=your_key
```

### Deploy Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

## ⚙️ Future Enhancements

- [ ] User authentication (login/signup)
- [ ] Stripe payment integration
- [ ] Product reviews and ratings
- [ ] Admin dashboard for managing products
- [ ] Email notifications for orders
- [ ] Multi-language support
- [ ] Voice chat capability

## 🐛 Troubleshooting

### CORS Error
- Ensure backend is running on port 5000
- Check frontend proxy settings in `vite.config.js`

### OpenAI API Error
- Verify API key in `.env`
- Check API key has sufficient credits
- Ensure OPENAI_API_KEY is set before starting server

### Database Error
- Delete `chatbot.db` to reset database
- Check write permissions in project directory

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# or use different port in .env
PORT=5001
```

## 📚 Learn More

- [OpenAI API Docs](https://platform.openai.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## 📄 License

MIT License - Feel free to use this project for learning and development!

---

**Built with ❤️ | Happy Chatting! 🤖**
