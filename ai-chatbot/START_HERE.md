# 🤖 START HERE - AI Electronics Chatbot

## ⚡ Quick Start (3 Minutes)

### 1️⃣ Get OpenAI API Key
- Go to: https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key (it won't show again!)

### 2️⃣ Configure the Chatbot
Open the `.env` file and replace:
```
OPENAI_API_KEY=your_openai_api_key_here
```
With your actual key:
```
OPENAI_API_KEY=sk-proj-xxxxx...
```

### 3️⃣ Start the Backend
```bash
npm run dev
```
✅ Backend will run on http://localhost:5000

### 4️⃣ Start the Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
✅ Frontend will run on http://localhost:3000

### 5️⃣ Open Your Browser
```
http://localhost:3000
```

## 🎉 Start Chatting!

Try these prompts:
- "Show me wireless headphones"
- "I need a gaming keyboard"
- "What's the best laptop cooling pad?"
- "Add the keyboard to my cart"

---

## 📚 Documentation

- **README.md** - Full documentation & API reference
- **SETUP.md** - Detailed setup instructions
- **PROJECT_COMPLETE.md** - What's been built
- **QUICK_REFERENCE.sh** - Useful commands

## 🆘 Troubleshooting

**CORS Error?**
- Make sure backend is running on port 5000

**API Error?**
- Check your OpenAI API key in .env
- Verify it's correct and has credits

**Port Already in Use?**
- Edit .env and change PORT to 5001
- Or: use ps aux | grep node and check processes

**Dependencies Not Found?**
```bash
npm install
cd frontend && npm install
```

## ✨ You're Ready!

Your chatbot is fully built and ready to go. Just add your API key and start!

👉 **Next: Edit .env and add your OpenAI API key**

---

**Questions?** Check README.md for complete documentation!
