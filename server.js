const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ===== Homepage Route =====
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ===== Contact / Booking Route =====
app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const recipientEmail = 'vmdigitalswebdevelopment@gmail.com';

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: recipientEmail,
        pass: process.env.PTSO, // Gmail App Password
      },
    });

    // Email content
    const mailOptions = {
      from: `"VM Digitals Website" <${recipientEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Email error:', err);
        return res.status(500).json({ message: 'Failed to send email' });
      }

      res.status(200).json({ message: 'Message sent successfully!' });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});