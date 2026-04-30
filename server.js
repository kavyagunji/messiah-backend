require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ SendGrid transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ✅ Email API
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, city, phone, message } = req.body;

    const mailOptions = {
      from: 'your_verified_email@gmail.com', // MUST verify in SendGrid
      to: 'your_verified_email@gmail.com',
      replyTo: email,
      subject: 'New Prayer Request',
      text: `
Name: ${name}
Email: ${email}
City: ${city || 'N/A'}
Phone: ${phone || 'N/A'}
Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
