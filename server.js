require('dotenv').config();

/*const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

//  Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

//  Health check
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

//  Create transporter ONCE (important)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4, // 🔥 force IPv4 (fix ENETUNREACH)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // must be App Password
  }
});

// Verify transporter at startup
transporter.verify((error) => {
  if (error) {
    console.error(' EMAIL CONFIG ERROR:', error);
  } else {
    console.log(' Email server ready');
  }
});

//  Handle GET (avoid browser loading issue)
app.get('/send-email', (req, res) => {
  res.send('Use POST method to send email');
});

//  Email API (NON-BLOCKING)
app.post('/send-email', (req, res) => {
  console.log('DATA RECEIVED:', req.body);

  const { name, email, city, phone, subject, message } = req.body;

  //  Step 1: Respond immediately (NO WAITING)
  res.status(200).json({ message: 'Request received successfully' });

  //  Step 2: Send email in background
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

  transporter.sendMail(mailOptions)
    .then(info => {
      console.log(' EMAIL SENT:', info.response);
    })
    .catch(err => {
      console.error(' EMAIL ERROR:', err);
    });
});

//  Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});*/

corequire('dotenv').config();
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Test Email',
  text: 'This is a test email.'
}).then(info => {
  console.log('Email sent:', info.response);
}).catch(err => {
  console.error('Error sending email:', err);
});
