# 🚀 AI Electronics Chatbot - Setup Guide

## Step 1: Get OpenAI API Key

1. Go to [openai.com](https://openai.com)
2. Sign up or log in to your account
3. Navigate to API keys section
4. Create a new secret key
5. Copy the key (you won't see it again!)

## Step 2: Configure Environment

Open the `.env` file in the `ai-chatbot` folder and add your key:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxx
PORT=5000
NODE_ENV=development
```

## Step 3: Start the Application

### Option A: Using the Start Script (Linux/Mac)

```bash
cd ai-chatbot
bash start.sh
```

This will automatically start both backend and frontend.

### Option B: Manual Start (Any OS)

**Terminal 1 - Backend:**
```bash
cd ai-chatbot
npm run dev
```

You should see: `Backend server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd ai-chatbot/frontend
npm run dev
```

You should see: `VITE v... ready in xxx ms`

## Step 4: Open the Chatbot

Open your browser and go to:
```
http://localhost:3000
```

## 🎉 You're Ready!

Start chatting! Try these:
- "Show me wireless headphones"
- "What's the best laptop cooling solution?"
- "I need a keyboard for gaming - what do you recommend?"
- "Add headphones to my cart"

## 🔧 Common Issues

### Issue: CORS Error
- Make sure backend is running on port 5000
- Check Network tab in browser DevTools

### Issue: "OpenAI API Error"
- Verify your API key in `.env`
- Ensure the key is valid and has credits

### Issue: "Cannot find module"
- Run `npm install` in both root and `frontend` directories

### Issue: Port Already in Use
- Change PORT in `.env` (e.g., `PORT=5001`)
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

## 📚 Next Steps

1. **Customize Products**: Edit sample products in `database.js`
2. **Add Features**: Check README.md for ideas
3. **Deploy**: See README.md deployment section
4. **Enhance AI**: Modify system prompt in `server.js` line ~75

## 💡 Tips

- The database (`chatbot.db`) is created automatically on first run
- Chat history is saved to the database
- Cart and orders persist during the session

---

**Questions?** Check the README.md file for more details!
