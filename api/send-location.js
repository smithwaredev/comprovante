const axios = require("axios");

module.exports = async (req, res) => {
  // Permite requisições de qualquer origem (evita CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" });
  }

  const { latitude, longitude, maps } = req.body;

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ success: false, message: "Tokens do Telegram não configurados." });
  }

  try {
    // 1. Envia o mapa interativo para o Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`, {
      chat_id: TELEGRAM_CHAT_ID,
      latitude: latitude,
      longitude: longitude
    });

    // 2. Envia a mensagem de texto com os detalhes
    const message = `📍 Localização recebida\nMaps: ${maps}\nLatitude: ${latitude}\nLongitude: ${longitude}`;
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    });

    return res.status(200).json({ success: true, message: "Enviado com sucesso!" });
  } catch (error) {
    console.error("Erro no envio:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Erro ao enviar." });
  }
};
