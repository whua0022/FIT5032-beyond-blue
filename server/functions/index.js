const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require('firebase-functions/params');
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const sgMail = require('@sendgrid/mail');
const axios = require('axios');

// Define the OpenAI API key secret
const openAiApiKey = defineSecret('OPENAI_API_KEY');
const sendGridApiKey = defineSecret('SENDGRID_API_KEY');

admin.initializeApp();

// Middleware to parse incoming JSON requests
const app = require('express')();
app.use(require('body-parser').json());

exports.sendEmail = onRequest({ secrets: [sendGridApiKey] }, (req, res) => {
    cors(req, res, async () => {
        try {
            // Set the API key from the secret
            sgMail.setApiKey(sendGridApiKey.value());

            const { to, emailSubject, emailMessage } = req.body;

            const msg = {
                to: to,
                from: 'fit5032beyondblue@gmail.com',  // Sender's email
                subject: emailSubject,
                text: emailMessage,
                html: `<strong>${emailMessage}</strong>`,  // HTML version of the email
            };

            await sgMail.send(msg);
            res.status(200).send('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    });
});

exports.countEvents = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const eventsCollection = admin.firestore().collection("events");
            const data = await eventsCollection.get();
            const count = data.size;

            res.status(200).send({ count });
        } catch (error) {
            console.error("Error counting events:", error);
            res.status(500).send("Error counting events");
        }
    });
});

// New function to handle suggestions and call OpenAI API
exports.getSuggestionsFromGPT = onRequest({ secrets: [openAiApiKey] }, (req, res) => {
    cors(req, res, async () => {
        try {
            const { descriptions, userInput } = req.body;
            const prompt = `
                Here are event descriptions:\n
                ${descriptions.join('\n')}
                User input: ${userInput}
                Based on these, which event would be most suitable for me?
            `;

            // Call OpenAI API
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        { "role": "system", "content": "You are a helpful assistant." },
                        { "role": "user", "content": prompt }
                    ],
                    max_tokens: 150,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openAiApiKey.value()}`,
                    },
                }
            );
            const suggestion = response.data.choices[0].message.content.trim();

            res.status(200).send({ suggestion });
        } catch (error) {
            console.error("Error calling Chatgpt:", error);
            res.status(500).send("Error calling Chatgpt");
        }
    });
});
