const axios = require('axios');

const sendEventToMeta = async ({
  pixelId,
  accessToken,
  eventName,
  eventSourceUrl,
  userAgent,
  actionSource = 'website',
  eventTime = Math.floor(Date.now() / 1000),
  customData = {},
  userData = {}
}) => {
  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_source_url: eventSourceUrl,
        action_source: actionSource,
        user_data: {
          client_user_agent: userAgent,
          ...userData
        },
        custom_data: {
          currency: 'USD', // default currency
          ...customData
        }
      }
    ]
  };

  const url = `https://graph.facebook.com/${process.env.META_GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`;

  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.error('Meta Conversions API Error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendEventToMeta;
