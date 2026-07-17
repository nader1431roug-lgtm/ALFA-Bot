const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {

  name: 'partner',
    
  aliases: ['pt'],

  owners: true,

  async execute(message) {

    const embed = new EmbedBuilder()

      .setTitle('الـبـارتـنـر')

      .setDescription(`**
\`\`\`
قــوانـيـن الـبـارتـنـر الـخـاصـة بـ 𝐀𝐋𝐅𝐀 𝐌𝐞𝐦𝐛𝐞𝐫𝐬
\`\`\` :

-  يـجـب أن يـكـون عــدد اعـضـاء سـيـرفـرك لا يـقـل عـن 100 عــضـو 


-  يـجـب احـتـرام الاونــر و عــدم مـنـشـن


-  يـسـتـحـب أن يـكـون نــوع الـسـيـرفـر بـيـع اعــضـاء مــثـلـنـا 


-# لــطـلـب بـارتـنـر يـرجـى الـضـغـط عـلـى الـزر بالاسـفـل
**`)

      .setColor(`${EMBED_COLOR}`)
      
      .setImage('https://i.postimg.cc/854LpcSg/Untitled62-20260124081708.png')
    
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(

      new ButtonBuilder()

        .setCustomId('partner-request')

        .setLabel('طـلـب بـارتـنـر')
        
        .setStyle(ButtonStyle.Secondary),

    );

    await message.channel.send({ embeds: [embed], components: [row] });

await message.channel.send(`${SERVER_LINE}`);
  },

};