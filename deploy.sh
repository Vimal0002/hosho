#!/bin/bash

# ============================================================================
# ElectroMinds - Deployment Script
# ============================================================================
# This script deploys your ElectroMinds application to Vercel
# ============================================================================

set -e

echo "🚀 ElectroMinds Deployment Script"
echo "=================================="
echo ""

# Step 1: Load NVM
echo "Step 1: Loading Node.js..."
source ~/.nvm/nvm.sh
node_version=$(node --version)
echo "✅ Node.js $node_version ready"
echo ""

# Step 2: Navigate to project
echo "Step 2: Navigating to project..."
cd /home/bandya/Downloads/hosho
echo "✅ In project directory"
echo ""

# Step 3: Check dependencies
echo "Step 3: Verifying dependencies..."
npm --version > /dev/null 2>&1 && echo "✅ npm ready" || echo "⚠️  npm not found"
vercel --version > /dev/null 2>&1 || echo "⚠️  Vercel CLI not found, installing..."
npm list -g vercel > /dev/null 2>&1 || npm install -g vercel
echo "✅ All dependencies ready"
echo ""

# Step 4: Build verification
echo "Step 4: Verifying build..."
npm run build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build verified successfully"
else
    echo "❌ Build failed! Check /tmp/build.log for details"
    exit 1
fi
echo ""

# Step 5: Deploy to Vercel
echo "Step 5: Deploying to Vercel..."
echo "Instructions:"
echo "  1. You will be prompted to log in to Vercel"
echo "  2. Select your project or create a new one"
echo "  3. Confirm deployment settings"
echo "  4. Your site will be live in 30-60 seconds!"
echo ""
read -p "Ready to deploy? Press Enter to continue..."
echo ""

vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "Your ElectroMinds application is now live!"
echo ""
echo "Next steps:"
echo "  1. Check your live URL above"
echo "  2. Test all pages (Home, About, Contact, Gallery)"
echo "  3. Verify mobile responsiveness"
echo "  4. Share your site!"
echo ""
echo "Need to add API keys?"
echo "  Run: vercel env add GEMINI_API_KEY"
echo "  Then: vercel --prod (to redeploy with API key)"
echo ""

