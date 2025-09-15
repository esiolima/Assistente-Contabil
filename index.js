const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/whatsapp', (req, res) => {
  const twiml = new MessagingResponse();
  const msg = req.body.Body || '';

  twiml.message(`Você disse: ${msg}`);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
