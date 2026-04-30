require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dns = require('dns');
const net = require('net');

// ✅ Force IPv4 preference
dns.setDefaultResultOrder('ipv4first');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Transporter with HARD IPv4 fix
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,

  // 🔥 IMPORTANT: Force IPv4 connection manually
  getSocket: (options, callback) => {
    dns.lookup(options.host, { family: 4 }, (err, address) => {
      if (err) return callback(err);

      const socket = net.createConnection({
        host: address,
        port: options.port,
      });

      callback(null, socket);
    });
  },

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// ✅ Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email server error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

// ✅ API Route
app.post('/send-email', async (req, res) => {
  const { name, email, city, phone, countryCode, message } = req.body;

  if (!name || !email || !countryCode || !message) {
    return res.status(400).json({
      success: false,
      error: 'All required fields must be filled',
    });
  }

  try {
    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',

      text: `
Name: ${name}
Email: ${email}
City: ${city}
Phone: ${countryCode} ${phone}
Message: ${message}
      `,

      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>Phone:</b> ${countryCode} ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `,

      replyTo: email,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('📨 Email sent:', info.response);

    res.json({
      success: true,
      message: 'Email sent successfully',
    });

  } catch (error) {
    console.error('❌ Send error:', error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ✅ Start server (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});