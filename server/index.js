const express = require('express');
const sgMail = require('@sendgrid/mail');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Set up SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Define the POST endpoint to send the email
app.post('/send-email', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Content-Type", "application/json")
    const { to, emailSubject, emailMessage } = req.body;

    const msg = {
        to: to,
        from: 'fit5032beyondblue@gmail.com',
        subject: emailSubject,
        text: emailMessage,
        html: '<strong>Testing</strong>',
    };

    try {
        await sgMail.send(msg);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
