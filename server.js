require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// 1. MIDDLEWARE
app.use(cors({ origin: '*' }));
app.use(express.json());

// 2. EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Correct SMTP host
    port: 465,
    secure: true, // true for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use the 16-character App Password here
    }
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Email Config Error:", error);
    } else {
        console.log("✅ Email Server is ready");
    }
});

// 3. ROUTES
app.get('/', (req, res) => {
    res.send('Messiah Backend is running...');
});

app.post('/send-email', (req, res) => {
    console.log('Data received:', req.body);
    const { name, email, city, phone, subject, message } = req.body;

    const adminMail = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: subject || 'New Contact Form Submission',
        text: `
        New Message Received:
        ----------------------
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'N/A'}
        City: ${city || 'N/A'}
        Message: ${message}
        `
    };

    const userMail = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'We Received Your Message',
        text: `Hi ${name},\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\nGod bless you!`
    };

    Promise.all([
        transporter.sendMail(adminMail),
        transporter.sendMail(userMail)
    ])
    .then(() => {
        console.log("Emails sent successfully");
        res.status(200).json({ success: true, message: 'Emails sent successfully' });
    })
    .catch((err) => {
        console.error("Email Error:", err);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    });
});

// 4. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
