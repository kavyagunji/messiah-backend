app.post('/send-email', (req, res) => {
    const { name, email, city, phone, subject, message } = req.body;

    // Use a single response for the request
    res.status(200).json({ message: 'Request received successfully' });

    // Admin notification
    const adminMail = {
        from: process.env.EMAIL_USER, // Must be your kavyagunji39@gmail.com
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: subject || 'New Prayer Request',
        text: `Name: ${name}\nEmail: ${email}\nCity: ${city}\nPhone: ${phone}\nMessage: ${message}`
    };

    // User confirmation
    const userMail = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'We received your request',
        text: `Hi ${name}, thank you for contacting us.`
    };

    // Send mails (Removed the undefined mailOptions call)
    transporter.sendMail(adminMail).catch(err => console.error("Admin Error:", err));
    transporter.sendMail(userMail).catch(err => console.error("User Error:", err));
});
