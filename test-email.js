// Test Email Script
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('📧 Testing Email Configuration...');
    console.log(`User: ${process.env.EMAIL_USER}`);
    console.log(`Pass: ${process.env.EMAIL_PASS ? '********' : 'Missing'}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Missing credentials in .env.local');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'ElectroMinds Test Email',
            text: 'If you receive this, your email configuration is working perfectly! 🚀'
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email Failed:');
        console.error(error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Tip: Gmail often blocks sign-ins. You must use an "App Password", not your login password.');
            console.log('   Go to: Google Account > Security > 2-Step Verification > App Passwords');
            console.log('   Create one named "ElectroMinds" and use that 16-character code in .env.local');
        }
    }
}

testEmail();
