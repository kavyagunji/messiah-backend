require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: '*' // later you can restrict to your Angular domain
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Email API
app.post('/send-email', async (req, res) => {
  console.log("DATA RECEIVED:", req.body);

  const { name, email, city, phone, subject, message } = req.body;

  try {
  const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4, // 🔥 force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

    let emailSubject = '';
    let emailText = '';

    if (subject) {
      emailSubject = `Contact Form: ${subject}`;
      emailText = `
Name: ${name}
Email: ${email}
Message: ${message}
      `;
    } else {
      emailSubject = 'New Prayer Request';
      emailText = `
Name: ${name}
Email: ${email}
City: ${city || 'N/A'}
Phone: ${phone || 'N/A'}
Message: ${message}
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to yourself
      replyTo: email,
      subject: emailSubject,
      text: emailText
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("EMAIL SENT:", info);

    res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// PORT for deployment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
