
import nodemailer from 'nodemailer';

// Use environment variables for security, or default to a placeholder
// Use explicit SMTP settings for better reliability
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendOrderEmail(toEmail, orderDetails) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials missing. Skipping real email send.");
        return false;
    }

    const mailOptions = {
        from: `"ElectroMinds Store" <${process.env.EMAIL_USER}>`, // Add a friendly name
        to: toEmail,
        subject: `Your ElectroMinds Order Receipt 🧾`, // Friendlier subject
        text: `Hey there! 👋\n\nThanks a ton for your order at ElectroMinds!\n\nHere is your receipt:\n\nOrder ID: ${orderDetails.id}\nDate: ${new Date().toLocaleString()}\n\n----------------------------\nITEMS:\n${orderDetails.items.map(i => `- ${i.quantity} x Item ${i.id}`).join('\n')}\n----------------------------\n\nTotal Paid: $${orderDetails.total}\n\nShipping to:\n${orderDetails.address}\n\nWe'll notify you when it ships! 🚚\n\nCheers,\nElectroMinds AI Team`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Success] Sent to: ${toEmail} | MsgID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`[Email Failed] Could not send to ${toEmail}:`, error);
        return false;
    }
}
