const axios = require('axios');

module.exports = async (req, res) => {
  const { event_name, event_time, event_source_url, action_source, user_data } = req.body;

  // Capturar IP do cliente (Vercel usa headers específicos)
  const client_ip_address = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '';

  const payload = {
    data: [{
      event_name,
      event_time,
      event_source_url,
      action_source,
      user_data: {
        ...user_data,
        client_ip_address,
      },
    }],
    access_token: process.env.FACEBOOK_ACCESS_TOKEN, // Variável da Vercel
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${process.env.FACEBOOK_PIXEL_ID}/events`,
      payload
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};