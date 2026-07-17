module.exports = {
    name: 'leaveall',
    owners: true, 
    async execute(message, args, client) {
      const guilds = client.guilds.cache;
  
      if (!guilds.size) {
        return message.reply('The bot is not in any servers.');
      }
  
      try {
        for (const guild of guilds.values()) {
          await guild.leave();
          message.channel.send(`The bot has left **${guild.name}** (${guild.id}).`);
        }
  
        message.reply('The bot has left all servers.');
      } catch (error) {
        console.error('Failed to leave all servers:', error);
        message.reply('An error occurred while trying to leave all servers.');
      }
    },
  };