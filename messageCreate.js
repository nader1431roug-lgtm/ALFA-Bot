const {
  PREFIX,
  BALANCE_PRICE,
  TOKEN,
  CLIENT_ID,
  EMBED_COLOR,
  SERVER_LINE,
  CLIENT_SECRET,
  MAIN_SERVER_ID,
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
} = require('../config.js');

module.exports = {
  name: 'messageCreate',
 async execute(message, client) {
    if (message.author.bot || !message.guild) return;
    if (message.channel.id === TRANSACTIONS_CHANNEL && !(message.content.toLowerCase().startsWith('c') || message.content.toLowerCase().startsWith('#credit'))) return message.delete().catch(() => {});
    if (!message.content.startsWith(client.prefix)) return;
    
    const args = message.content.slice(client.prefix.length).trim().replaceAll('\n', ' ').split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.owners && !OWNERS.includes(message.author.id)) return;
    
    try {
      command.execute(message, args, client);
    } catch (e) {
      console.error(e);
    }
  },
};