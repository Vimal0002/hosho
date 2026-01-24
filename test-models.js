
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyAyU7fCFeaKC6S_SRRjva7xznxPEch2W7A"; // Hardcoded for this test script only
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // There isn't a direct listModels in the high-level SDK easily usage in this node script without getting into REST.
        // But we can try a simple generation with a known model.
        console.log("Trying gemini-1.5-flash...");
        const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res1 = await model1.generateContent("Hi");
        console.log("gemini-1.5-flash works:", res1.response.text());
    } catch (e) {
        console.log("gemini-1.5-flash failed:", e.message);
    }

    try {
        console.log("Trying gemini-pro...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const res2 = await model2.generateContent("Hi");
        console.log("gemini-pro works:", res2.response.text());
    } catch (e) {
        console.log("gemini-pro failed:", e.message);
    }
}

listModels();
