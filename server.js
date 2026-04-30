require('dotenv').config();
const nodemailer = require('nodemailer');

// Setup transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Verification Error:', error);
    } else {
        console.log('Server is ready to send emails');
        // Send test email
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: 'This is a test email'
        })
        .then(info => {
            console.log('Test email sent:', info);
        })
        .catch(err => {
            console.error('Error sending test email:', err);
        });
    }
});
