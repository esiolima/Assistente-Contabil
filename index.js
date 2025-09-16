const express = require('express');
const fetch = require('node-fetch');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PROJECT_ID = 'charismatic-web-403017';
const LOCATION = 'southamerica-east1';

const MODEL_ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash-lite:predict`;

app.post('/whatsapp', async (req, res) => {
  const userMessage = req.body.Body || '';

  try {
    const response = await fetch(MODEL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer AQ.Ab8RN6Kznq78YiRm_0grcId__qw4AnOycmgncoEqPzyq_RJAMQ' // Use sua chave válida aqui
      },
      body: JSON.stringify({
        prompt: {
          messages: [
            {
              author: "user",
              content: {
                text: userMessage
              }
            }
          ]
        }
      })
    });

    const data = await response.json();
    console.log('Resposta da API Gemini:', JSON.stringify(data, null, 2));

    let assistantReply = "Desculpe, não consegui entender.";
    if (data && data.candidates && data.candidates.length > 0) {
      const textParts = data.candidates[0].message.content.text;
      if (textParts) {
        assistantReply = textParts;
      }
    }

    const twiml = new MessagingResponse();
    twiml.message(assistantReply);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

  } catch (error) {
    console.error('Erro ao chamar API do assistente:', error);

    const twiml = new MessagingResponse();
    twiml.message("Desculpe, ocorreu um erro no servidor.");

    res.writeHead(500, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
