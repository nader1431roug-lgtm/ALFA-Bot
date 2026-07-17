const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'restart',
  owners: true, 
  description: 'إعـادة تـشـغـيـل الـبـوت',
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setTitle('إعـادة تـشـغـيـل الـبـوت')
      .setDescription('🔄 **هـل تـريـد بـالـتـأكـيـد إعـادة تـشـغـيـل الـبـوت؟ اضـغـط عـلـى الـزر أدنـاه لـلـتـأكـيـد.**')
      .setColor(EMBED_COLOR)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirm-restart')
        .setLabel('تـأكـيـد إعـادة الـتـشـغـيـل')
        .setStyle(ButtonStyle.Danger)
    );

    const sentMessage = await message.channel.send({ embeds: [embed], components: [row] })
    await message.channel.send(`${SERVER_LINE}`);

    const filter = (interaction) => interaction.customId === 'confirm-restart' && interaction.user.id === message.author.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async (interaction) => {
      await interaction.update({ components: [] });

      const restartEmbed = new EmbedBuilder()
        .setTitle('إعـادة الـتـشـغـيـل')
        .setDescription('🔄 **الـبـوت يـتـم إعـادة تـشـغـيـلـه الآن...**')
        .setColor(EMBED_COLOR)
        .setTimestamp();

      await message.channel.send({ embeds: [restartEmbed] })
        await message.channel.send(`${SERVER_LINE}`);

      process.exit(0); 
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        sentMessage.edit({ content: '❌ **لـم يـتـم الـتـأكـيـد، تـم إلـغـاء إعـادة الـتـشـغـيـل.**', components: [] });
      }
    });
  },
};