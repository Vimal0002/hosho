
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log("Testing email with...");
    console.log("User:", process.env.EMAIL_USER);
    // Don't log the full password for security, just length
    console.log("Pass length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Test Email from Bot",
            text: "If you see this, email configuration is WORKING!"
        });
        console.log("✅ Email sent successfully!", info.messageId);
    } catch (error) {
        console.error("❌ Email failed:", error.message);
        if (error.response) {
            console.error("Server response:", error.response);
        }
    }
}

testEmail();
