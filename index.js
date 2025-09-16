const express = require('express');
const fetch = require('node-fetch');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/whatsapp', async (req, res) => {
  console.log('Recebida mensagem do WhatsApp:', req.body.Body);

  const userMessage = req.body.Body || '';

  try {
    const response = await fetch('https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer AQ.Ab8RN6Kznq78YiRm_0grcId__qw4AnOycmgncoEqPzyq_RJAMQ'
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: userMessage }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Resposta da API Gemini:', JSON.stringify(data, null, 2));

    let assistantReply = "Desculpe, não consegui entender.";
    if (data && data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content.parts;
      if (parts && parts.length > 0 && parts[0].text) {
        assistantReply = parts[0].text;
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
