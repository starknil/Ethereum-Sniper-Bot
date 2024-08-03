const { bot } = require('./bot');

const sendMessage = async (_to, msg) => {
  try {
    await bot.telegram.sendMessage(_to, msg, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
    return true;
  } catch (err) {
    console.error('Failed to send message:' + err);
  }
};

module.exports = sendMessage;