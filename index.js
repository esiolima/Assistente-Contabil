const express = require('express');
const fetch = require('node-fetch');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/whatsapp', async (req, res) => {
  const userMessage = req.body.Body || '';

  try {
    // Requisição à API Gemini 2.5 Flash-Lite corrigida
    const response = await fetch('https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer AQ.Ab8RN6Kznq78YiRm_0grcId__qw4AnOycmgncoEqPzyq_RJAMQ'
      },
      body: JSON.stringify({
        instances: [
          {
            content: {
              text: userMessage
            }
          }
        ],
        parameters: {
          temperature: 0.2
        }
      })
    });

    const data = await response.json();
    console.log('Resposta da
