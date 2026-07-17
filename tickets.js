const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'delete-tickets',
  owners: true,
  async execute(message, args, client) {
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.reply('لـيـس لـديـك إذن لـحـذف الـقـنـوات.');
    }

    const targetChannels = message.guild.channels.cache.filter(channel => 
      channel.name.startsWith('buy-') || channel.name.startsWith('closed-')
    );

    if (targetChannels.size === 0) {
        const embed = new EmbedBuilder()
      . setDescription('لـم يـتـم الـعـثـور عـلـى أي قـنـوات تـبـدأ بـ "buy-" أو "closed-".')
        .setTimestamp();
       
    await message.channel.send({
        embeds: [embed]
        })
    }

    targetChannels.forEach(channel => {
      channel.delete()
        .then(() => console.log(`تـم حـذف الـقـنـاة: ${channel.name}`))
        .catch(err => console.error(`فـشـل حـذف الـقـنـاة ${channel.name}:`, err));
    });

    const embed1 = new EmbedBuilder()
      .setDescription(`تـم حـذف جـمـيـع الـقـنـوات الـتـي تـبـدأ بـ "buy-" أو "closed-" بـنـجـاح.`);

    message.channel.send({ embeds: [embed1] });
  },
};