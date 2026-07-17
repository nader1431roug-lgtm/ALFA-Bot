const { SERVER_LINE } = require('../../config.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


module.exports = {
name: 'hbyp',
owners: true,
async execute (message) {

const row = new ActionRowBuilder().addComponents(

     new ButtonBuilder()
     .setLabel('طريقة الشراء')
     .setCustomId('how-button')
     
     .setStyle(ButtonStyle.Secondary)
     
);
const snd = await message.channel.send({
components: [row]
});
await message.channel.send(`${SERVER_LINE}`);


}
};