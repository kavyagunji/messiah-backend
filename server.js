require('dotenv').config();

const express = require('express');
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

//  Admin email (you receive)
const adminMail = {
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

// User confirmation email
const userMail = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'We received your request',
  text: `
Hi ${name},

Thank you for contacting us. We received your request and will get back to you soon.

God bless you 
  `
};

//  Send both
transporter.sendMail(adminMail)
  .then(() => console.log("Admin mail sent"))
  .catch(err => console.error("Admin mail error:", err));

transporter.sendMail(userMail)
  .then(() => console.log("User mail sent"))
  .catch(err => console.error("User mail error:", err));

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
});
