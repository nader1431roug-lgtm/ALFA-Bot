const { EmbedBuilder, ActionRowBuilder,StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {

name: 'pembed',

aliases: ['pd'],

owners: true,

async execute(message) {
    const channel = message.channel
    
    const btn = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel('Order')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/channels/1454039618436731044/1464482036956790855')
        );

    const embed = new EmbedBuilder()
    .setTitle('اسـعـار الاعـضـاء')
    .setDescription('**سـعـر العـضو : 2500**')
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })
                })
    .setImage('https://i.postimg.cc/g0msb9vS/Untitled59-20260123200750.png');
                
  await message.channel.send({
      embeds: [embed],
      components: [btn]
    });

   


}
};