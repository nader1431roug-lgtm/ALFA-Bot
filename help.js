const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE, PREFIX, OWNERS } = require('../../config.js');

module.exports = {
  name: 'help',
  async execute(message, args, client) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('1')
        
        .setLabel('Public'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('3')
        
        .setLabel('Owner'),
    );

    const msg = await message.channel.send({ embeds: [], components: [row] })
    await message.channel.send(`${SERVER_LINE}`);

    const filter = (interaction) => interaction.isButton();
    const collector = msg.createMessageComponentCollector({ filter, time: 300000000 });

    collector.on('collect', async (interaction) => {
      const userId = interaction.user.id;
      const buttonId = interaction.customId;
        
        
  
      
      let replyText1 =  new TextDisplayBuilder().setContent(`**+stock** لـمـعـرفـة سـتـوك الـأعـضـاء الـمـتـواجـد فـي الـمـخـزون
**+coins** لـمـعـرفـة رصـيـدك الـحـالـي
**+boost** لـاسـتـلام هـديـة الـبـوسـت
**+top** أعـلـى 6 أشـخـاص يـمـتـلـكـون كـويـنـز`);
      let replyText2 = new TextDisplayBuilder().setContent(`**${PREFIX}give [user] [amount]** لـإضـافـة كـويـنـز لـلـعـضـو
**${PREFIX}take [user] [amount]** لـسـحـب كـويـنـز مـن الـعـضـو
**${PREFIX}bank [bank id]** لـوضـع ايـدي الـبـنـك الـجـديـد
**${PREFIX}limite [limite members]** لـوضـع أقـل عـدد لـلأعـضـاء مـن الـشـراء
**${PREFIX}clinet [role id]** لـوضـع رول الـشـراء
**${PREFIX}stock img [img link]** لـوضـع صـورة لـلسـتـوك
**${PREFIX}panel img [img link]** لـوضـع صـورة لـلبـانـل وايـضـاً يـمـكـنـك تـركـهـا بـدون صـورة
**${PREFIX}add [serverid] [amount]** لـإدخـال أعـضـاء لـلـسـيـرفـر
**${PREFIX}check [user]** لـفـحـص إذا الـشـخـص مـوثـق نـفـسـه أم لا
**${PREFIX}send** لـبـعـث زر وثـق نـفـسـك
**${PREFIX}refresh** لـعـمـل رفـرش لـلسـتـوك
**${PREFIX}spun** لـإرسـال زر عـجـلـة حـظ 
**${PREFIX}delete-tickets** اغـلاق كـل الـتـذاكـر
**${PREFIX}restart** لـإعـادة تـشـغـيـل الـبـوت
**${PREFIX}panel** لـبـعـث لـوحـة شـراء أعـضـاء
**${PREFIX}transfer** لـتـحـديـد روم الـتـحـويـل
**${PREFIX}taxid** لـتـحـديـد روم الـضـريـبـة
**${PREFIX}leave [server id]** لـلـخـروج مـن سـيـرفـر الـبـوت فـيـه
**${PREFIX}log** لـوضـع ايـدي روم تـمـت الـعـمـلـيـة
**${PREFIX}price** لـوضـع سـعـر الـأعـضـاء
**${PREFIX}leaveall** لـإخـراج الـبـوت مـن جـمـيـع الـسـيـرفـرات
**${PREFIX}set name [name]** لـوضـع اسـم لـلـبـوت
**${PREFIX}set avatar [avatar link]** لـتـغـيـيـر صـورة الـبـوت
**${PREFIX}mozz3 [mozz3 role id]** لـوضـع ايـدي رول الـمـوزعـيـن`);
      
        const replyCont1 = new ContainerBuilder()
      .setAccentColor((parseInt(EMBED_COLOR.replace('#', ''), 16)))

      .addTextDisplayComponents(
          replyText1
          );
        const replyCont2 = new ContainerBuilder()
        .setAccentColor((parseInt(EMBED_COLOR.replace('#', ''), 16)))

        .addTextDisplayComponents(
            replyText2
            );
         
       if (buttonId === '1') {
        
       return interaction.reply({
           flags: MessageFlags.IsComponentsV2,
           components: [replyCont1],
           ephemeral: true
           
           });
           
           }
       if (buttonId === '3') {
           
         if (!OWNERS.includes(interaction.user.id)) {
             return interaction.reply({ content: '** OWNERS ONLY !**', ephemeral: true });
             }
           
        return interaction.reply({
            flags: MessageFlags.IsComponentsV2,
            components: [replyCont2],
            ephemeral: true
            });
           
           }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        msg.edit({ components: [row] });
      }
    });
  },
};