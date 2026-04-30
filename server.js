require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

//  Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

//  Health route (for quick checks / uptime pings)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

//  Create transporter ONCE (important)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS //  must be Gmail APP PASSWORD
  },
  connectionTimeout: 10000, // 10s
  greetingTimeout: 10000,
  socketTimeout: 15000
});

//  Verify at startup
transporter.verify((error) => {
  if (error) {
    console.error(' EMAIL CONFIG ERROR:', error);
  } else {
    console.log(' Email server ready');
  }
});

//  Email API
app.post('/send-email', async (req, res) => {
  console.log('DATA RECEIVED:', req.body);

  const { name, email, city, phone, subject, message } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject ? `Contact Form: ${subject}` : 'New Prayer Request',
      text: `
Name: ${name}
Email: ${email}
City: ${city || 'N/A'}
Phone: ${phone || 'N/A'}
Message: ${message}
      `
    };

    //  Ensure we never hang forever
    const sendMailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Email timeout')), 15000)
    );

    const info = await Promise.race([sendMailPromise, timeoutPromise]);

    console.log('EMAIL SENT:', info);

    return res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('FULL ERROR:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send email'
    });
  }
});

//  Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
