#!/bin/bash

# AI Electronics Chatbot - Quick Start Script

echo "🤖 Starting AI Electronics Chatbot..."
echo ""

# Check if .env exists and OpenAI key is set
if [ ! -f .env ]; then
  echo "❌ .env file not found!"
  echo "Please create .env with your OpenAI API key:"
  echo "  OPENAI_API_KEY=your_key_here"
  echo "  PORT=5000"
  exit 1
fi

if grep -q "your_openai_api_key_here" .env; then
  echo "❌ Please add your OpenAI API key to .env file!"
  exit 1
fi

echo "✅ .env file found"
echo ""

# Start backend
echo "🚀 Starting Backend (port 5000)..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if ! curl -s http://localhost:5000/api/health > /dev/null; then
  echo "❌ Backend failed to start"
  kill $BACKEND_PID
  exit 1
fi

echo "✅ Backend is running!"
echo ""

# Start frontend in new terminal or background
echo "🎨 Starting Frontend (port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!

sleep 3

echo ""
echo "════════════════════════════════════════════════"
echo "✅ AI Electronics Chatbot is Ready!"
echo "════════════════════════════════════════════════"
echo ""
echo "🌐 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:5000"
echo "📖 Docs:      http://localhost:3000"
echo ""
echo "Type 'exit' or press Ctrl+C to stop"
echo ""

# Keep script running
wait
