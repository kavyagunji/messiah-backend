const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to send email
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  // Basic validation
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Log request body
  console.log('Received email request:', req.body);

  // Configure your SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email provider
    auth: {
      user: 'kavyagunji39@gmail.com', // your email
      pass: 'qjfiawaboxyzcxck',        // your email password or app password
    },
  });

  // Email options
  const mailOptions = {
    from: 'your.email@gmail.com',
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
