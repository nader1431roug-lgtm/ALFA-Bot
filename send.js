const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {
  PREFIX,
  BALANCE_PRICE,
  TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  MAIN_SERVER_ID,
  EMBED_COLOR,
  SERVER_LINE,
  ATHBET_NAFSEK_LOG,
  MONGOOSE,
  BALANCE_LOG,
  STOCK_CHANNEL, 
  STOCK_MESSAGE,
  CLIENTS_ROLE, 
  DONE_CHANNEL, 
  SUPERCLIENTS_ROLE, 
  MIN_MEMBERS,
  MOZAA_PRICE,
REDIRECT_URI,
  RECIPIENT_ID,
  MOZAA_ROLE, 
  TRANSACTIONS_CHANNEL,
  TAX_CHANNEL, 
  supprt,
  logs,
  AUTH_URL,
  BOT_URL,
  PROBOT_IDS, 
  OWNERS,
} = require('../../config.js');
module.exports = {
  name: 'send',
  async execute(message, args, client) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('اثـبـت نـفـسـك')
        .setURL(AUTH_URL)
        
    );

    await message.channel.send({
      content: '** اثـبـت نـفـسـك مـن الـزر فـي الاسـفـل **',
      components: [row],
    })
      await message.channel.send(`${SERVER_LINE}`);
  },
};