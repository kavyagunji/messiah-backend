require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server running ✅');
});

// Email API
app.post('/send-email', async (req, res) => {
  const { name, email, city, phone, countryCode, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: process.env.EMAIL_USER },
        to: [{ email: process.env.EMAIL_USER }],
        subject: 'New Contact Form',
        htmlContent: `
          <h2>Contact Form</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>City:</b> ${city}</p>
          <p><b>Phone:</b> ${countryCode} ${phone}</p>
          <p><b>Message:</b> ${message}</p>
        `
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ success: true, message: 'Email sent ✅' });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: 'Failed to send email'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});