app.post('/send-email', async (req, res) => {
  console.log("DATA RECEIVED:", req.body);

  const { name, email, city, phone, message } = req.body;

  // ✅ Send response immediately (DO NOT WAIT)
  res.status(200).json({ message: 'Request received' });

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
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

    // 🔥 Send email in background (no blocking)
    transporter.sendMail(mailOptions)
      .then(info => console.log("EMAIL SENT:", info))
      .catch(err => console.error("EMAIL ERROR:", err));

  } catch (error) {
    console.error("ERROR:", error);
  }
});
