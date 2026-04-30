require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json()); // To parse JSON request bodies

// Debug logs to verify environment variables
console.log('Email:', process.env.EMAIL_USER);
console.log('Password:', process.env.EMAIL_PASS);

try {
  // Create the transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email verification failed:', error);
      process.exit(1); // Exit if verification fails
    } else {
      console.log('Email server is ready');
    }
  });

  // POST route to send email
  app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    transporter.sendMail(mailOptions)
      .then(info => {
        console.log('Email sent:', info.response);
        res.json({ message: 'Email sent successfully' });
      })
      .catch(error => {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
      });
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

} catch (err) {
  console.error('Error during setup:', err);
  process.exit(1);
}
