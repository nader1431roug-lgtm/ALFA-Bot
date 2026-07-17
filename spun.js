const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const usersData = require('../../src/models/Users.js');

module.exports = {
  name: 'spin',
  owners: true,
  async execute(message, args, client) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('spinWheel')
        .setLabel('Spin the Wheel!')
        .setStyle(ButtonStyle.Primary)
    );

    const sentMessage = await message.channel.send({
      content: `**اضـغـط عـلـى الـزر لـلـقـيـام بـلـف الـعـجـلـة والـفـوز بـرصـيـد عـشـوائـي!**`,
      components: [row],
    });

    const collector = sentMessage.createMessageComponentCollector();

    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: '**لا يـمـكـنـك اسـتـخـدام هـذا الـزر!**', ephemeral: true });
      }

      const userData = await usersData.findOne({ id: interaction.user.id }) || new usersData({ id: interaction.user.id });

      if (userData.balance < 50) {
        return interaction.reply({ content: '**عـذراً، تـحـتـاج إلـى 50 كـويـن عـلـى الأقـل لـلـقـيـام بـلـف الـعـجـلـة.**', ephemeral: true });
      }

      userData.balance -= 50;
      await userData.save();

      const randomAmount = Math.floor(Math.random() * 91) + 10; 

      userData.balance += randomAmount; 
      await userData.save();

      const logChannel = message.guild.channels.cache.find(channel => channel.name === 'spun-logs');
      if (!logChannel) {
        return; 
      }

      logChannel.send(`**<@${interaction.user.id}> قـام بـلـف الـعـجـلـة وفـاز بـ ${randomAmount} كـويـن!**`);

      interaction.user.send(`لـقـد قـمـت بـلـف الـعـجـلـة وفـزت بـ ${randomAmount} كـويـن.`);

      await interaction.reply({ content: `✅ **تـم لـف الـعـجـلـة بـنـجـاح! فـزت بـ ${randomAmount} كـويـن.**`, ephemeral: true });

      collector.stop(); 
    });
  },
};