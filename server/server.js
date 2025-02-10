const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Configurações
app.use(cors()); // Permitir requisições do frontend
app.use(express.json());

// Rota para enviar eventos ao Facebook
app.post('/enviar-evento', async (req, res) => {
  console.log('Dados recebidos do frontend:', req.body); // <-- Adicione esta linha

  const { event_name, event_time, event_source_url, action_source, user_data } = req.body;

  // Capturar IP do cliente
  const client_ip_address = req.headers['x-forwarded-for'] || req.ip;

  // Montar payload para o Facebook
  const payload = {
    data: [{
      event_name: event_name || 'Lead', // Garante um nome de evento padrão
      event_time: event_time || Math.floor(Date.now() / 1000),
      event_source_url: event_source_url || 'http://localhost:5500', // URL do seu site local
      action_source: action_source || 'website',
      user_data: {
        ...user_data,
        client_ip_address: client_ip_address,
        // Adicione campos obrigatórios (mesmo vazios)
        em: user_data?.em || [], // Email hasheado (array)
        ph: user_data?.ph || [], // Telefone hasheado (array)
      },
    }],
    access_token: process.env.FACEBOOK_ACCESS_TOKEN,
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${process.env.FACEBOOK_PIXEL_ID}/events`,
      payload
    );
    console.log('Resposta do Facebook:', response.data); // <-- Adicione esta linha
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Erro detalhado:', error.response?.data); // <-- Adicione esta linha
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});