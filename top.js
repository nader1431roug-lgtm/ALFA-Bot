const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js'); 
const usersData = require('../../src/models/Users.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'top',
  async execute(message, args, client) {
    const topUsers = await usersData.find().sort({ balance: -1 }).limit(10);

    const buttons = await Promise.all(topUsers.map(async (user, index) => {
      const fetchedUser = await client.users.fetch(user.id, false);

           return new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`user_${user.id}`)
        .setLabel(`${index + 1}. ${fetchedUser.username}`);
    }));

    const rows = [];
    while (buttons.length > 0) {
      rows.push(new ActionRowBuilder().addComponents(buttons.splice(0, 5)));
    }

    message.reply({ content: 'أعـلـى 10 مـسـتـخـدمـيـن بـحـسـب الـكـويـنـز:', components: rows })
      await message.channel.send(`${SERVER_LINE}`);
  },
};