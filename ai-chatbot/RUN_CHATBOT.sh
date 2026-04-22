#!/bin/bash

echo "🚀 STARTING AI ELECTRONICS CHATBOT"
echo ""
echo "Starting servers... Please wait..."
echo ""

# Start backend in background
cd /home/bandya/Downloads/hosho/ai-chatbot
echo "▶️  Starting Backend (Port 5000)..."
node server.js &
BACKEND_PID=$!
sleep 3

# Start frontend in background
cd /home/bandya/Downloads/hosho/ai-chatbot/frontend
echo "▶️  Starting Frontend (Port 3000)..."
node_modules/.bin/vite --host 0.0.0.0 &
FRONTEND_PID=$!
sleep 5

echo ""
echo "════════════════════════════════════════════"
echo "✅ SERVERS STARTED SUCCESSFULLY"
echo "════════════════════════════════════════════"
echo ""
echo "🌐 OPEN IN BROWSER:"
echo "   http://localhost:3000"
echo ""
echo "Backend:  http://localhost:5000/api/health"
echo "Frontend: http://localhost:3000"
echo ""
echo "Process IDs:"
echo "Backend:  $BACKEND_PID"
echo "Frontend: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running
wait
