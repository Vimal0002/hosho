const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No API Key found in .env.local");
    process.exit(1);
}

console.log(`🔑 Key found: ${apiKey.substring(0, 5)}...`);

async function testConnection() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "Reply with 'API Online' if you can hear me.";
        console.log("📡 Sending test request to Gemini...");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ API Response Received:", text);
    } catch (error) {
        console.error("❌ API Test Warning:", error.message);
    }
}

testConnection();
