
import nodemailer from 'nodemailer';

// Use environment variables for security, or default to a placeholder
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // e.g. rp0366685@gmail.com
        pass: process.env.EMAIL_PASS  // App Password
    }
});

export async function sendOrderEmail(toEmail, orderDetails) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials missing. Skipping real email send.");
        return false;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: `Order Confirmation: ${orderDetails.id}`,
        text: `Thank you for your order!\n\nOrder ID: ${orderDetails.id}\nTotal: $${orderDetails.total}\n\nItems:\n${orderDetails.items.map(i => `- ${i.id} (x${i.quantity})`).join('\n')}\n\nShipping to: ${orderDetails.address}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${toEmail}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}
