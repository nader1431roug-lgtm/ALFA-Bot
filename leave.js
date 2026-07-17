
module.exports = {
  name: 'leave',
  owners: true,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('يـرجـى إدخـال ايـدي الـخـادم لـلـمـغـادرة');
    }

    const serverId = args[0];
    const guild = client.guilds.cache.get(serverId);

    if (!guild) {
      return message.reply('لـسـت مـوجـوداً فـي هـذا الـخـادم');
    }

    await guild.leave();
    message.channel.send(`تـم الـمـغـادرة: \`${guild.name}\` (${guild.id})`);
  },
};
