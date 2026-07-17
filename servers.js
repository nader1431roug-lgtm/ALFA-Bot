const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'servers',
  owners: true,
  async execute(message, args, client) {
    const guilds = client.guilds.cache;

    if (!guilds.size) {
      return message.reply('The bot is not in any servers.');
    }

    const serverList = guilds.map(guild => `**${guild.name}** - \`${guild.id}\``).join('\n');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('leave_all')
        .setLabel('Leave All')
        .setStyle(ButtonStyle.Danger)
    );

    await message.channel.send({ content: serverList, components: [row] });

    const filter = (interaction) => interaction.customId === 'leave_all' && interaction.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'leave_all') {
        for (const guild of guilds.values()) {
          await guild.leave();
        }
        await interaction.update({ content: 'The bot has left all servers.', components: [] });
      }
    });

    collector.on('end', (collected) => {
      if (!collected.size) {
        message.channel.send('No action was taken.');
      }
    });
  },
};