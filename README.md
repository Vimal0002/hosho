
# ElectroMinds: Intelligent Omni-channel Electronics Assistant

This is a Next.js application powered by Google Gemini to act as an intelligent assistant for buying electronics.

## Features
- **Product Recommendations**: Smart suggestions based on inventory.
- **Order Management**: Place, Track, Cancel, and Return orders.
- **Admin Tools**: Inventory updates (simulated) and Sales reporting.
- **Email Simulation**: Generates Markdown tables for order confirmations.
- **Premium UI**: Glassmorphism design with responsive chat interface.

## Setup

1. **Install Dependencies** (if not done):
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the root directory and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *If you don't have a key, the app will simulate a connection failure or use a mock logic if configured.*

3. **Run Locally**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Usage
- **Customer**: "I want to buy a TV", "Track my order", "Cancel order ORD123".
- **Admin**: "Show me sales trends", "Update inventory".

## Tech Stack
- Next.js (App Router)
- React
- Google Generative AI SDK
- Vanilla CSS (Glassmorphism)
