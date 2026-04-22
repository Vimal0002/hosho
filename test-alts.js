const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyAyU7fCFeaKC6S_SRRjva7xznxPEch2W7A";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    const models = ["gemini-2.0-flash-001", "gemini-2.5-flash"];

    for (const m of models) {
        console.log(`Testing ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hi");
            console.log(`✅ SUCCESS: ${m}`);
            console.log(result.response.text());
        } catch (error) {
            console.log(`❌ FAILED: ${m}`);
            console.log(error.message);
        }
    }
}

test();
