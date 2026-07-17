const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, SeparatorBuilder, MessageFlags, MediaGalleryBuilder, TextDisplayBuilder } = require('discord.js'); 
const usersData = require('../../src/models/Users.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

let stockImage = "https://i.postimg.cc/GmbrYpwr/Untitled62-20260123230632.png";
module.exports = {
  name: 'stock',
  async execute(message, args, client) {
    if (args[0] === 'img') {
      if (args[1]) {
        stockImage = args[1];
        const successMessage = await message.reply({ content: 'تـم تـحـديـث الـبـيـانـات بـنـجـاح.', ephemeral: true });
        setTimeout(() => successMessage.delete(), 5000);
        return;
      } else {
        return message.reply('يـجـب تـقـديـم رابـط الـصـورة.');
      }
    }

    let usersCount = await usersData.countDocuments({ accessToken: { $exists: true } });
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel('Refresh')
        .setCustomId('refresh_stock'),
        
      new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel('Buy')
          .setCustomId('stock-buy')

    );
let stockTxt = new TextDisplayBuilder().setContent(`-  **ALFA Members stock :** **${usersCount}** !`);
      
  const container = new ContainerBuilder()
.setAccentColor((parseInt(EMBED_COLOR.replace('#', ''), 16)))
  .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems([
          {
              media: {
                  url: `${stockImage}`
                  }
                  }
              ])
          )
  .addSeparatorComponents(
      new SeparatorBuilder()
      )
  .addTextDisplayComponents(
      stockTxt
      )
  .addSeparatorComponents(
      new SeparatorBuilder()
      )
  .addActionRowComponents(
      row
      );
    await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] })
      await message.channel.send(`${SERVER_LINE}`);
  },
};