const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, InteractionType, ContainerBuilder, TextDisplayBuilder, SectionBuilder, SeparatorBuilder, MessageFlags, MediaGalleryBuilder } = require('discord.js');
const {
  PREFIX,
  BALANCE_PRICE,
  TOKEN,
  SERVER_LINE,
  EMBED_COLOR,
  CLIENT_ID,
  CLIENT_SECRET,
  MAIN_SERVER_ID,
  ATHBET_NAFSEK_LOG,
  MONGOOSE,
  BALANCE_LOG,
  STOCK_CHANNEL, 
  STOCK_MESSAGE,
  CLIENTS_ROLE, 
  DONE_CHANNEL, 
  SUPERCLIENTS_ROLE, 
  MIN_MEMBERS,
  MOZAA_PRICE,
REDIRECT_URI,
  RECIPIENT_ID,
  MOZAA_ROLE, 
  TRANSACTIONS_CHANNEL,
  TAX_CHANNEL, 
  supprt,
  logs,
  AUTH_URL,
  BOT_URL,
  fa7sbot,
  fa7s_url,
  PROBOT_IDS, 
  OWNERS,
  FEEDBACK_CHANNEL_ID
} = require('../config.js');
const Users = require('../src/models/Users');
const cooldowns = new Map();
const mCooldowns = new Map();
const m2Cooldowns = new Map();


async function checkFa7sBot(guild) {
  try {
    const cachedBot = guild.members.cache.get(fa7sbot);
    if (cachedBot) {
      return { exists: true };
    }
    try {
      const fa7sBot = await guild.members.fetch(fa7sbot).catch(() => null);
      if (fa7sBot) {
        return { exists: true };
      }
    } catch {}
    const botInviteUrl = `${fa7s_url}`;
    
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('❌ بوت الفحص غير موجود')
      .setDescription('يجب إضافة بوت الفحص إلى السيرفر قبل الشراء!')
      .addFields(
        { name: 'التعليمات:', value: '1️⃣ اضغط على الزر لإضافة بوت الفحص\n2️⃣ تأكد من منحه الصلاحيات المطلوبة\n3️⃣ أعد المحاولة بعد إضافته' },
        { name: 'ملاحظة:', value: 'لن تتمكن من إتمام عملية الشراء بدون البوت' }
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('إضافة بوت الفحص')
        .setURL(botInviteUrl)
        .setStyle(ButtonStyle.Link)
    );

    return { 
      exists: false, 
      embed: embed, 
      row: row 
    };
  } catch (error) {
    console.error('خطأ في التحقق من بوت الفحص:', error);
    return { exists: false };
  }
}
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (interaction.customId === 'buy-balance') {
        if (cooldowns.has(interaction.user.id)) {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('cancel-buy')
              .setStyle(ButtonStyle.Danger)
              .setLabel('إلـغـاء عـمـلـيـة الـشـراء')
          );
      
          return interaction.reply({
            content: ' **حـدث خـطـأ! لـديـك عـمـلـيـة شـراء قـيـد الـتـنـفـيـذ بـالـفـعـل. يـرجـى الـانـتـظـار حـتـى تـنـتـهـي الـعـمـلـيـة الـحـالـيـة.**',
            components: [row],
            ephemeral: true,
          });
        }
      
        if (m2Cooldowns.has(interaction.user.id)) {
          return interaction.reply({
            content: ' **يـرجـى الـانـتـظـار حـتـى تـنـتـهـي الـعـمـلـيـة الـسـابـقـة قـبـل الـبـدء بـعـمـلـيـة شـراء جـديـدة.**',
            ephemeral: true,
          });
        }
      
        const modal = new ModalBuilder()
          .setCustomId('balance-modal')
          .setTitle('شـراء رصـيـد');
      
        const amount = new TextInputBuilder()
          .setCustomId('amount')
          .setMinLength(1)
          .setMaxLength(5)
          .setPlaceholder('مـثـال: 50')
          .setStyle(TextInputStyle.Short)
          .setLabel('الـكـمـيـة');
      
        const row = new ActionRowBuilder().addComponents(amount);
        modal.addComponents(row);
      
        return interaction.showModal(modal);
      }

      if (interaction.customId === 'cancel-buy' && cooldowns.has(interaction.user.id)) {
        await cooldowns.delete(interaction.user.id);

        interaction.reply({
          content: ' **تـمـت بـنـجـاح! وهـذه الـعـمـلـيـة حـذفـت مـن الـبـيـانـات، أي يـمـكـنـك الـشـراء مـن جـديـد**',
          ephemeral: true
        });
      }

      if (interaction.customId === 'withdraw-m-balance' && !mCooldowns.has(interaction.user.id)) {
        if (cooldowns.has(interaction.user.id)) {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('cancel-buy')
            .setStyle(ButtonStyle.Danger)
            .setLabel('إنـهـاء عـمـلـيـة الـشـراء'));

          interaction.reply({
            content: ' **حـدث خـطـأ مـا، لـقـد وجـدت انـك تـمـتـلـك عـمـلـيـة شـراء بـالـفـعـل الـرجـاء قـم بـإلـغـائـهـا لـلـشـراء مـن جـديـد**',
            components: [row],
            ephemeral: true,
          });
        } else {
          if (m2Cooldowns.has(interaction.user.id)) return interaction.reply({
            content: ' **يـرجـى الـانـتـظـار إلـى أن تـنـتـهـي هـذه الـعـمـلـيـة**',
            ephemeral: true
          });

          const modal = new ModalBuilder()
            .setCustomId('members-modal')
            .setTitle('شـراء أعـضـاء');

          const id = new TextInputBuilder()
            .setCustomId('id')
            .setMinLength(1)
            .setPlaceholder('مـثـال: 1332811763460341872')
            .setStyle(TextInputStyle.Short)
            .setLabel('مـعـرف الـخـادم (Server ID)');

          const amount = new TextInputBuilder()
            .setCustomId('amount')
            .setMinLength(1)
            .setPlaceholder('مـثـال: 50')
            .setStyle(TextInputStyle.Short)
            .setLabel('الـكـمـيـة');

          const row = new ActionRowBuilder().addComponents(amount);
          const row1 = new ActionRowBuilder().addComponents(id);

          modal.addComponents(row, row1);
          interaction.showModal(modal);
        }
      }

      if (interaction.customId === 'cancel-m' && mCooldowns.get(interaction.user.id)?.messageId === interaction.message.id) {
        await mCooldowns.delete(interaction.user.id);

        interaction.reply({
          content: ' **تـم حـذف هـذه الـعـمـلـيـة مـن قـاعـدة الـبـيـانـات نـهـائـيـاً!**',
          ephemeral: true
        });
      }

      const blacklist = ["SERVER_ID_1", "SERVER_ID_2", "SERVER_ID_3"];

      async function ensureMemberAdded(guild, userId, accessToken) {
        try {
          await guild.members.add(userId, { accessToken });
          return true;
        } catch (error) {
          return false;
        }
      }

      if (
        interaction.customId.startsWith("join") &&
        mCooldowns.get(interaction.user.id)?.messageId === interaction.message.id
      ) {
        const members = mCooldowns.get(interaction.user.id).members;
        let halfwayAlerted = false;

        if (m2Cooldowns.has(interaction.user.id)) {
          return interaction.reply({
            content: " **تـم اسـتـخـدام هـذا الـزر مـن قـبـل. يـرجـى الـانـتـظـار قـبـل الـمـحـاولـة مـرة أخـرى.**",
            ephemeral: true,
          });
        }

        mCooldowns.delete(interaction.user.id);

        let done = 0, failed = 0;
        const successfulMembers = [];
        const failedMembers = [];
        const totalMembers = members.length;
        const startTime = Date.now();

        try {
          const userData = await client.db.users.patch(interaction.user.id);
          const [, ID] = interaction.customId.split("-");
          const guild = client.guilds.cache.get(ID);

          if (blacklist.includes(ID)) {
            return interaction.reply({
              content: " **هـذا الـخـادم مـحـظـور ولا يـمـكـن الـانـضـمـام إلـيـه.**",
              ephemeral: true,
            });
          }

          if (!guild) {
            return interaction.reply({
              content: " **يـجـب إدخـال الـبـوت إلـى هـذا الـخـادم!**",
              ephemeral: true,
            });
          }

         const fa7sCheck = await checkFa7sBot(guild);
            if (!fa7sCheck.exists) {
              return interaction.reply({
                embeds: [fa7sCheck.embed],
                components: [fa7sCheck.row],
                ephemeral: false
              });
            }
          const msg = await interaction.reply({
            content: " **جـاري إدخـال الـأعـضـاء...**\n▫️▫️▫️▫️▫️▫️▫️▫️▫️▫️ 0%",
            ephemeral: true,
          });

          const deductedAmount = totalMembers;
          userData.balance -= deductedAmount;
          await userData.save();
          await m2Cooldowns.set(interaction.user.id);

                             const delay = (ms) => new Promise(res => setTimeout(res, ms));
const chunkSize = 5;    

        for (let i = 0; i < members.length; i++) {
  const member = members[i];

  const userId = member.id;
  const accessToken = member.accessToken;

  try {
    const success = await ensureMemberAdded(guild, userId, accessToken);

    if (success) {
      done++;
      successfulMembers.push(userId);
    } else {
      failed++;
      failedMembers.push(userId);
    }
  } catch {
    failed++;
    failedMembers.push(userId);
  }

  const processed = done + failed;

  const percentage = Math.floor((processed / totalMembers) * 100);

  const progressBar =
    "~".repeat(Math.floor(percentage / 10)) +
    " • ".repeat(10 - Math.floor(percentage / 10));

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

  const timeRemaining = processed > 0
    ? ((elapsedTime / processed) * (totalMembers - processed)).toFixed(2)
    : 0;

  await msg.edit(` **جـاري الإدخـال:**\n${progressBar}

${percentage}%\n ✔️: ${done} | ✖️ : ${failed}\n- الـوقـت الـمـتـبـقـي الـمـتـوقـع: ${timeRemaining} ثـانـيـة`);

  // 🔥 مهم جدًا
  await new Promise(res => setTimeout(res, 2500));
}


          m2Cooldowns.delete(interaction.user.id);

          const duration = ((Date.now() - startTime) / 1000).toFixed(2);

          const summaryMessage = done > 0
            ? ` **تـم بـنـجـاح! إدخـال ${done} عـضـو. فـشـل إدخـال ${failed} عـضـو.**\n اسـتـغـرق: ${duration} ثـانـيـة`
            : " **فـشـل الإدخـال بـالـكـامـل!**";

          await msg.edit(summaryMessage);

          const resultMessage = done > 0
            ? `**
              تـم إدخـال ${done} عـضـو بـنـجـاح.\n
              فـشـل إدخـال ${failed} عـضـو.\n
               مـدة الـعـمـلـيـة: ${duration} ثـانـيـة
            **\n🔹 **الـأعـضـاء الـنـاجـحـون:** ${successfulMembers.join(", ")}\n🔹 **الـأعـضـاء الـفـاشـلـون:** ${failedMembers.join(", ")}`
            : " **فـشـل إدخـال جـمـيـع الـأعـضـاء. حـاول لـاحـقـاً.**";

          interaction.user.send(resultMessage);

          const doneChannel = client.channels.cache.get(logs);
          if (doneChannel && done > 0) {
            const embed = new EmbedBuilder()
              .setColor(`${EMBED_COLOR}`)
              .setDescription(
                `**تـم شـراء \`${done}\` عـضـو بـواسـطـة: ${interaction.user}**\n` +
                (failed > 0 ? ` **فـشـل إدخـال ${failed} عـضـو**` : "") +
                `\n **اسـتـغـرق الـعـمـلـيـة: ${duration} ثـانـيـة**`
              )
              .setTimestamp();

            doneChannel.send({ embeds: [embed] });
          }
          const useData = await client.db.users.patch(interaction.user.id);
          useData.balance += failed
          await useData.save();
        } catch (error) {
          console.error("Error during the join process:", error);
          interaction.followUp({
            content: " **حـدث خـطـأ غـيـر مـتـوقـع أثـنـاء الإدخـال. حـاول مـرة أخـرى لـاحـقـاً.**",
            ephemeral: true,
          });
        }
      }
      
 if (interaction.isButton() && interaction.customId.startsWith('box_collect_')) {
  const reward = Number(interaction.customId.split('_')[2]);

  const userData = await client.db.users.patch(interaction.user.id);
  userData.balance += reward;
  await userData.save();
const autoClaimRow = new ActionRowBuilder().addComponents (
     new ButtonBuilder()
         .setLabel('Claimed')
         .setCustomId('auto-dis-Cbtn')
         .setDisabled(true)
         .setStyle(ButtonStyle.Secondary),
            )
   const autoClaimText = new TextDisplayBuilder().setContent(`###  Lucky Box!

**
مــبــروك ${interaction.user} لــقــد حــصــلــت عــلــى \`${reward} كــويــنــز !\`
**

`)
    const autoClaimContainer = new ContainerBuilder()
       
.addSeparatorComponents(
    new SeparatorBuilder()
    )
            .addTextDisplayComponents(
       autoClaimText,
            )

     .addActionRowComponents(
         autoClaimRow,
         )
       .addSeparatorComponents(
    new SeparatorBuilder()
    );

  
  await interaction.update({
      flags: MessageFlags.IsComponentsV2,
      components: [autoClaimContainer] });
}
     // box.js 
   else if (interaction.customId.startsWith('box_cmd_')) {
        const reward = Number(interaction.customId.split('_')[2]);
        if (isNaN(reward)) return;

        // تحديث البالانس
        const userData = await client.db.users.patch(interaction.user.id);
        userData.balance += reward;
        await userData.save();
const claimRow = new ActionRowBuilder().addComponents (
     new ButtonBuilder()
         .setLabel('Claimed')
         .setCustomId('disCbtn')
         .setDisabled(true)
         .setStyle(ButtonStyle.Secondary),
            )
   const claimText = new TextDisplayBuilder().setContent(`###  Lucky Box!

**
مــبــروك ${interaction.user} لــقــد حــصــلــت عــلــى \`${reward} كــويــنــز !\`
**

`)
    const claimcontainer = new ContainerBuilder()
       
.addSeparatorComponents(
    new SeparatorBuilder()
    )
            .addTextDisplayComponents(
       claimText,
            )

     .addActionRowComponents(
         claimRow,
         )
       .addSeparatorComponents(
    new SeparatorBuilder()
    );
        
        await interaction.update({ flags: MessageFlags.IsComponentsV2,
                                  components: [claimcontainer] });
     
 }
      else if (interaction.customId === 'enter_giveaway') {
          
const auth_row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setLabel('اثــبــت نــفــســك')
    
    .setURL(AUTH_URL)
    .setStyle(ButtonStyle.Link),
    
    );
          const auth_embed = new EmbedBuilder()
          .setDescription(`** عـذراً، يـجـب عـلـيـك تـوثـيـق نـفـسـك أولاً لـلـمـشـاركـة!\nقـم بـالـتـوثـيـق مـن هـنـا :**`)
          .setColor(`${EMBED_COLOR}`)
          .setFooter({
              text: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true })
              });
const userData = await client.db.users.patch(interaction.user.id);
if (!userData || !userData.accessToken) {
return interaction.reply({
embeds: [auth_embed],
components: [auth_row],
ephemeral: true
});
}

const giveaway = client.giveaways?.get(interaction.message.id);  
    if (!giveaway) return interaction.reply({ content: ' **هـذا الـقـيـف اواي انـتـهـى!**', ephemeral: true });  

    if (giveaway.participants.has(interaction.user.id)) {  
      return interaction.reply({ content: ' **أنـت مـشـارك بـالـفـعـل!**', ephemeral: true });  
    }  

    giveaway.participants.add(interaction.user.id);  
    await interaction.reply({ content: ' **تـم تـسـجـيـل مـشـاركـتـك بـنـجـاح!**', ephemeral: true });  
  }
        
 if (interaction.customId === '') {
     
 await interaction.reply({
     
     });
     
     }
        
     if (interaction.customId === 'how-button') {
         
     const vid = new MediaGalleryBuilder().addItems([
         {
           media: {
               url: 'https://cdn.discordapp.com/attachments/1464482064979067165/1466494400665358591/lv_0_20260129211632.mp4?ex=697d9b97&is=697c4a17&hm=92e0c993cd41b358008dd19a0e245d85b1540eb8ab58c1b02c903566ff3b61df&'
               
               }
             
             }
         ]);

  await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [vid],
      ephemeral: true
  });

}   
        
        
        }
          
      
      if (interaction.customId === 'english_embed') {
      const englishEmbed = new EmbedBuilder()
        .setImage(`https://i.postimg.cc/pV8t6jPx/Untitled62-20260123225930.png`)
        .setDescription(
          `**1- The sale process is 100% automatic, no need to wait for anyone to assist.

2- Sending an amount less than required is your responsibility, and no compensation will be provided.

3- Sending the required amount to the wrong account is your responsibility, and no compensation will be provided.

4- Due to Discord policies, not all members may join, but we guarantee 50-60% entry.

5- Compensation is only provided if you purchase 200 members or more.

6- Re-purchasing for the same server = no compensation.**`
        )
        .setColor(`${EMBED_COLOR}`)
        .setTimestamp();

      await interaction.reply({
        embeds: [englishEmbed],
        ephemeral: true,
      });
    }

    if (interaction.customId === 'refresh_stock') {
      const usersCount = await Users.countDocuments({ accessToken: { $exists: true } });
        const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel('Refresh')
        .setCustomId('refresh_stock')

    );
      let updateStockTxt = new TextDisplayBuilder().setContent(`-  **ALFA Members stock :** **${usersCount}** !`);
      
  const updateContainer = new ContainerBuilder()
.setAccentColor((parseInt(EMBED_COLOR.replace('#', ''), 16)))
  .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems([
          {
              media: {
                  url: 'https://i.postimg.cc/GmbrYpwr/Untitled62-20260123230632.png'
                  }
                  }
              ])
          )
  .addSeparatorComponents(
      new SeparatorBuilder()
      )
  .addTextDisplayComponents(
      updateStockTxt
      )
  .addSeparatorComponents(
      new SeparatorBuilder()
      )
  .addActionRowComponents(
      row
      );

      await interaction.update({ flags: MessageFlags.IsComponentsV2,
components: [updateContainer]});
    }
     if (interaction.isStringSelectMenu()) {
  if (interaction.customId !== 'support-panel-select') return;

  const value = interaction.values[0];

  if (value === 'rst-value') {

  await interaction.reply({
      content: '**Done Reset**',
      ephemeral: true
      });
      
  }
    
 if (value === 'sup-value') {
     
     const member = interaction.member;
     
     const guild = interaction.guild;
     
     const supRole = '1464481687470604399';
     
      await interaction.reply({
      content: ' **جـاري إنـشـاء تـذكـرتـك... يـرجـى الانـتـظـار.**',
      ephemeral: true,
    });

    try {
      const SupChannel = await guild.channels.create({
        name: `sup-${member.user.username}`,
        type: 0,
        topic: `تـذكـرة الـدعـم الـخـاصـة بـ ${member.user.tag}`,
        parent: '1464481698937962730',
        permissionOverwrites: [
          { id: member.id, allow: ['ViewChannel', 'SendMessages'] },
          { id: supRole, allow: ['ViewChannel', 'SendMessages']
           },
          { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
        ],
      });
        
   const txtT = new TextDisplayBuilder().setContent('Welcome! Please describe your issue here, and the support team will assist you shortly.');
        
   const Trow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
       .setLabel('Close Ticket')
       .setCustomId('cls-tick')
       .setStyle(ButtonStyle.Danger),
       
       new ButtonBuilder()
       .setLabel('Claim Ticket')
       .setCustomId('clm-tick')
       .setStyle(ButtonStyle.Success)
       );
        
    const tContainer = new ContainerBuilder()
   .addSeparatorComponents(
       new SeparatorBuilder()
       )
    .addTextDisplayComponents(
        txtT
        )
    .addSeparatorComponents(
        new SeparatorBuilder()
        )
    .addActionRowComponents(
        Trow,
        );
  
  await SupChannel.send({
      content: `${member} | <@&${supRole}>`,
      });
   await SupChannel.send({
       flags: MessageFlags.IsComponentsV2,
      components: [tContainer]
      });
        await SupChannel.send({
            content: `**

 Disturbing or repeatedly calling the administration is prohibited. Anyone who does so will have their ticket closed.

 Write your topic clearly from the moment you open the ticket.

 Opening tickets for jokes or without a reason is prohibited.

 Be respectful. Any rudeness will result in the ticket being closed immediately.
**`
            });
        await SupChannel.send(`${SERVER_LINE}`);
        
         await interaction.editReply({
        content: ` **تـم إنـشـاء تـذكـرتـك بـنـجـاح! يـمـكـنـك الـدخـول إلـى الـقـنـاة الـتـالـيـة: ${SupChannel}.**`,
        ephemeral: true,
      });

     
        } catch (error) {
      console.error('Error creating ticket:', error);
      await interaction.editReply({
        content: '❌ **حـدث خـطـأ أثـنـاء إنـشـاء الـتـذكـرة. يـرجـى الـمـحـاولـة لاحـقـاً.**',
        ephemeral: true,
      });
    }

     
     }
}
      
 if (interaction.isButton()) {
   
   const isAdmin = interaction.member.permissions.has('Administrator');
     
 if (interaction.customId === 'cls-tick') {
     if (!isAdmin) {
   return interaction.reply({
       content: '❌ You don\'t have permission to use this button!',
       ephemeral: true
       });
     }
     
  await interaction.channel.delete();
     
     }
 
     
 if (interaction.customId === 'clm-tick') {
     if (!isAdmin) {
         return interaction.reply({
             content: '❌ You don\'t have permission to use this button!',
             ephemeral: true
             });
     }
      
       const DTrow = new ActionRowBuilder().addComponents(

      new ButtonBuilder()

       .setLabel('Close Ticket')

       .setCustomId('cls-tick')

       .setStyle(ButtonStyle.Danger),

       

       new ButtonBuilder()

       .setLabel('Claimed')

       .setCustomId('clm-tick')
           
       .setDisabled(true)

       .setStyle(ButtonStyle.Success)

       );
     const DtxtT = new TextDisplayBuilder().setContent('Welcome! Please describe your issue here, and the support team will assist you shortly.');
   
      const DtContainer = new ContainerBuilder()
   .addSeparatorComponents(
       new SeparatorBuilder()
       )
    .addTextDisplayComponents(
        DtxtT
        )
    .addSeparatorComponents(
        new SeparatorBuilder()
        )
    .addActionRowComponents(
        DTrow,
        );
  
     await interaction.update({
         flags: MessageFlags.IsComponentsV2,
         components: [DtContainer]
         });
   const clmTxt = new TextDisplayBuilder().setContent(`The ticket was received by ${interaction.member}`)
     
  const clmCont = new ContainerBuilder()
  .addTextDisplayComponents(
      clmTxt
      );
     
   await interaction.channel.send({
       flags: MessageFlags.IsComponentsV2,
       components: [clmCont]
       });
     
     
     }
     }
      
      
      
 if (interaction.isStringSelectMenu()) {

      if (interaction.customId !== 'buy-panel-select') return;

      const value = interaction.values[0];
     if (value === 'how to add bot to the server') {
  const embed1 = new EmbedBuilder()
  
  .setTitle('كيف اضيف البوت للسيرفر ؟')
  .setDescription(`**
- روح عـلـى روم الـشـراء و اضـغـط زر  :اضـافـة الـبـوت 🤖

- 2 انـزل اسـفـل قـلـيـلا و اخـتـر الـسـيـرفـر الـ عـايـز يـدخـل فـيـه الاعـضـاء 

- اضـغـط عـلـى الـزر الازرق و بـكـدا تـم ادخـال الـبـوت بـنـجـاح**`)
  .setColor(`${EMBED_COLOR}`)
  .setFooter({
      text: `made by : ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL()
      })
  .setTimestamp();
         
        return interaction.deferReply({ embeds: [embed1], ephemeral: true });

      }

      if (value === 'فايدة بوت الفحص') {
const embed2 = new EmbedBuilder()
.setTitle('فايدة بوت الفحص ؟')
.setDescription(`**
الـسـؤال الـفـعـلـي : \`لـيـش فـي بــوت فـحـص اصـلا ؟\`
الـسـبـب :

1 - بـوت الـفـحـص بـيـسـاعـد فـي فـحـص الـسـتـوك مـن الاعـضـاء الاعـضـاء الـتـالـفـة ( داخل 100 سيرفر و فوق)

2 - بـوت الـفـحـص بـيـسـاعـد فـي دخـول الاعـضـاء لـسـيـرفـرك وهـو عـامـل اسـاسـي فـي الـمـوضـوع

3 - بـوت الـفـحـص اضـافـتـه سـهـلـه جـدا فـقـط اضـغـط الـزر و ضـيـفـه لـنـفـس الـسـيـرفـر ال عـايـز تـدخـل الاعـضـاء فـيـه**`)
.setColor(`${EMBED_COLOR}`)
.setFooter({
    text: `made by : ${interaction.user.username}`,
    iconURL: interaction.user.displayAvatarURL()
    })
.setTimestamp();
          
        return interaction.reply({ embeds:[embed2], ephemeral: true });

      }
     if (value === 'how to buy') {
         const embed3 = new EmbedBuilder()
         .setTitle('ازاي اشتري اعضاء من السيرفر ؟')
         .setDescription(`**

1 - قــم بـالـتـوجـه الـى : <#1464482036956790855>

2 - اضـغـط عـلـى الـزر : فـتـح تـذكـرة 🎟️

3 - بـعـد دخـولـك لـلتـذكـرة قـم بـالـضـغـط عـلـى زر : شــراء رصــيـد 💳

4 - قــم بـكـتـابـة كـمـيـة الــرصـيـد الـذي تـريده

5 - بـعـد شــراء الـرصـيـد قــم بـالضـغـط عـلـى زر اضــافـة الـبـوت 🤖 

6 - بــعـد اضـافـة الـبـوت قـم بـالـضـغـط مـره اخـرى عـلـى زر : اضـافـة بـوت الـفـحـص 🔗

7 - بـعـد ادخـال كـل شـيـئ قــم بـالـضـغـط عـلـى زر : شــراء اعـضـاء 👥

8 - امـلـي جـمـيـع الـمـعـلـومـات ثــم قــم بـالـضـغـط عـلـى : \`Submit\` 

- ثــم انــتـظــر دخــول الاعــضـاء بـكـامـل الـصـبـر و سـيـتـم تـعـويـضـك اذا لــم يـدخـل كـامـل الــعـدد !**`)
         .setColor(`${EMBED_COLOR}`)
         .setFooter({
             text: `made by : ${interaction.user.username}`,
             iconURL: interaction.user.displayAvatarURL()
             })
         .setTimestamp();
         
        return interaction.reply({  embeds: [embed3], ephemeral: true });
      }

      if (value === 'how much stock') {
      
    const usersCount2 = await Users.countDocuments({ accessToken: { $exists: true } });
         
      const embed4 = new EmbedBuilder()
      .setTitle('كم عضو في الستوك ؟')
      .setDescription(`#  الـمخزون الـحـالي  

** المخزون الحالي :** ${usersCount2} عضو

 **متوفر الآن للشراء!**`)
      .setColor(`${EMBED_COLOR}`)
      .setFooter({
          text: `made by : ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL()
          })
      .setTimestamp();
          
        return interaction.reply({ embeds:[embed4], ephemeral: true });
      }
      if (value === 'ta3weed') {
       const embed5 = new EmbedBuilder()
       .setDescription(`#  التعويض التلقائي

**نظام التعويض:**

 البوت سيقوم بإعطائك كوينز (عملات) تلقائياً في حالة لم يدخل كل الأعضاء.

**التعويض يتم بشكل تلقائي بعد انتهاء عملية الإضافة.**`)
       .setColor(`${EMBED_COLOR}`)
       .setFooter({
           text: `made by : ${interaction.user.username}`,
           iconURL: interaction.user.displayAvatarURL()
           })
       .setTimestamp();
          
          
          
        return interaction.reply({ embeds: [embed5], ephemeral: true });
      }

      if (value === 'قيود ديسكورد') {
       const embed6 = new EmbedBuilder()
       .setDescription(`# قيود Discord

**لماذا لا يدخل كل الأعضاء؟**

لا يستطيع البوت إدخال جميع الأعضاء بسبب أن بعض الناس يكونون داخلين 100 سيرفر وما عندهم نيترو، فبسبب سياسات ديسكورد ما يقدر يدخل كل الأعضاء.

**قيود Discord:**

- حد أقصى 100 سيرفر للحسابات بدون Nitro

- حد أقصى 200 سيرفر للحسابات مع Nitro

- لهذا نوفر نظام التعويض التلقائي`)
       .setColor(`${EMBED_COLOR}`)
       .setFooter({
           text: `made by : ${interaction.user.username}`,
           iconURL: interaction.user.displayAvatarURL()
           })
       .setTimestamp();
          
          
          
          
        return interaction.reply({ embeds: [embed6], ephemeral: true });
      }
    }
/* partner interaction */
const logChannelId = '1464482058171715644'; // روم اللوج
const acceptSendChannelId = '1464482045354053855'; // روم ارسال رسالة القبول

if (interaction.isButton() && interaction.customId === 'partner-request') {
  // فتح مودال طلب بارتنر
  const modal = new ModalBuilder()
    .setCustomId('partner-modal')
    .setTitle('طلب شراكة');

  const serverDescInput = new TextInputBuilder()
    .setCustomId('server-desc')
    .setLabel('وصف السيرفر مع الرابط')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)

  const channelIdInput = new TextInputBuilder()
    .setCustomId('channel-id')
    .setLabel('ايدي روم البارتنر في سيرفرك')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder('مثال: 1234567890123456789')
    .setMaxLength(19)
 const allMembersCountInput = new TextInputBuilder()
 .setCustomId('all-members-count')
 .setLabel('عدد اعضاء سيرفرك')
 .setStyle(TextInputStyle.Short)
 .setRequired(true)

  modal.addComponents(
    new ActionRowBuilder().addComponents(serverDescInput),
    new ActionRowBuilder().addComponents(channelIdInput),
    new
ActionRowBuilder().addComponents(allMembersCountInput)
  );

  await interaction.showModal(modal);
}

else if (interaction.isModalSubmit() && interaction.customId === 'partner-modal') {
    
    await interaction.deferReply({
        ephemeral: true
        })
    
  const serverDesc = interaction.fields.getTextInputValue('server-desc');
  const channelId = interaction.fields.getTextInputValue('channel-id');
  const allMembersCount = interaction.fields.getTextInputValue('all-members-count');
  // التحقق من المينشنات
  if (serverDesc.includes('@everyone') || serverDesc.includes('@here')) {
    return interaction.editReply({
      content: '**يرجى كتابة وصف السيرفر مره اخرى بدون منشن @everyone أو @here**',
      ephemeral: true
    });
  }
    
    // 50 يشيك اذا كان عدد اعضاء السيرفر اقل من 
const membersCounts = Number(allMembersCount);
    
if (isNaN(membersCounts) || membersCounts < 100) {
  
  return interaction.editReply({
      content: 'يجب ان يكون عدد اعضاء سيرفرك اعلى من 100 عضو (اذا كذبت سوف يتم معاقبتك)',
      ephemeral: true
      });
    }
 
  if (/[a-zA-Z]/.test(channelId)) { 
   return  interaction.editReply({
        content: `يرجى اعادة كتابة ايدي الروم و عدم اضافة حروف داخله`,
        ephemeral: true
        });
      }
  // التحقق من طول ايدي الروم
  else if (channelId.length < 19) {
    return interaction.editReply({
      content: '**يرجى كتابة ايدي روم صحيح لا يقل عن 19 رقم**',
      ephemeral: true
    });
  }
else {
  try {
    await interaction.user.send(`
**__𝐀𝐋𝐅𝐀 𝐌𝐞𝐦𝐛𝐞𝐫𝐬 : __**
**
\`#\`  اعضـ1ء  و اسـ3ار منافسه للسـ9ـق  

 \`-\` العضـ9 الواحد : 800 كريـtـت   

\`-\` الكمية المتـ9فرة حاليا : +20 عضـ9  

---
__المميزات : __
\`-\` الستوك يوميا بيزيد بين 5-15 عـ3ـو 

\`-\` نسبة الدخول +60% لو اول مره ليك تشتـrـي من عندي  

\`-\` تكبر سيـrفرك بدل ما تشـtـري اعلان ويدخل لك بس 2-10 بالكتير  

\`-\` ريفريش تلقائي كل 5 ساعات   

---
 \`#\` وفر اموالك و كبر سيـrفرك   **

https://discord.gg/C3YUm7cg3F

@everyone`);
    await interaction.user.send(`**انشر هذا في روم\n - <#${channelId}>\n\n-# **||<@${interaction.user.id}>||**`);
  await interaction.user.send(`${SERVER_LINE}`);
    } catch {
        return interaction.editReply({
            content: 'خاصك مقفول روح افتحه و تعال ارجع حاول مره اخرى',
            ephemeral: true
            });
        }
    }
       
  // إرسال اللوج
  const logChannel = client.channels.cache.get(logChannelId);
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setTitle('📝 طلب شراكة جديد')
      .setThumbnail(interaction.user.displayAvatarURL())
      .setColor(`${EMBED_COLOR}`)
      .addFields(
        { name: 'الشخص الذي قدم الطلب', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'ايدي الشخص', value: `${interaction.user.id}`, inline: true },
        { name: 'وصف السيرفر', value: serverDesc },
        { name: 'ايدي روم البارتنر', value: `\`\`\`${channelId}\`\`\`` },
        { name: 'عدد أعضاء السيرفر', value: `\`\`\`${allMembersCount}\`\`\``, inline: true },
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('partner-accept').setLabel('✅ قبول').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('partner-reject').setLabel('❌ رفض').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('partner-reject-reason').setLabel('❌ رفض مع سبب').setStyle(ButtonStyle.Secondary)
    );

    await logChannel.send({ embeds: [embed], components: [row] });
  }

  return interaction.editReply({
    content: '✅ تم إرسال طلبك وسيتم مراجعتها من الإدارة',
    ephemeral: true
  });
}

// أزرار القبول / الرفض / الرفض مع سبب - قسم منفصل 
      
else if (interaction.isButton()) {
const disRow = new ActionRowBuilder().addComponents(

      new ButtonBuilder()

       .setCustomId('partner-accept')

       .setLabel('✅ قبول')

       .setDisabled(true)

       .setStyle(ButtonStyle.Success),

       

      new ButtonBuilder()

       .setCustomId('partner-reject')

       .setLabel('❌ رفض')

       .setDisabled(true)

       .setStyle(ButtonStyle.Danger),

       

      new ButtonBuilder()

       .setCustomId('partner-reject-reason')

       .setLabel('❌ رفض مع سبب')

       .setDisabled(true)

       .setStyle(ButtonStyle.Secondary)

       

    );
    
    if (interaction.customId === 'partner-accept') {
        
 await interaction.update({

     content: null,

     components: [disRow]

     });
const uembed = interaction.message.embeds[0];
  const userId = uembed.fields
    .find(f => f.name.includes('ايدي الشخص'))
    .value.replace(/[<@>]/g, '');

  const user = await client.users.fetch(userId);
    await user.send({ content: ` **تم قبول طلب الشراكة الخاص بك!**

شكراً لك على طلب الشراكة. تم قبول طلبك وسيتم إعلان الشراكة قريباً.\n\n-# **||<@${userId}>||**`, components: [] });
        const embed = interaction.message.embeds[0];
  if (!embed) return interaction.reply({ content: '❌ لا يوجد بيانات', ephemeral: true });

  // نجيب وصف السيرفر من الـ embed
  const serverDesc = embed.fields.find(f => f.name === 'وصف السيرفر')?.value;

  if (!serverDesc) {
    return interaction.reply({
      content: '❌ لم يتم العثور على وصف السيرفر',
      ephemeral: true
    });
  }

    const acceptChannel = client.channels.cache.get(acceptSendChannelId);
    if (acceptChannel) acceptChannel.send(`**||\@everyone||**\n\n${serverDesc}`);
  await acceptChannel.send(`**تبي مثله ؟ 🧐 حياك فك تكت <#1464482053373296671> 💖 **`);
  await acceptChannel.send(`${SERVER_LINE}`);
  }
  else if (interaction.customId === 'partner-reject') {
      
      await interaction.update({

     content: null,

     components: [disRow]

     });
      
      // نجيب ايدب الشخص من الـ embed
const uembed = interaction.message.embeds[0];
  const userId = uembed.fields
    .find(f => f.name.includes('ايدي الشخص'))
    .value.replace(/[<@>]/g, '');

  const user = await client.users.fetch(userId);
      
    await user.send({ content: `لـقـد تـم رفـض طـلـبـك فـي تـقـديـم الـبـارتـنـر.\n\n-# **||<@${userId}>||**` }).catch(() => {});
    await interaction.channel.send({ content: `**❌ تم رفض طلب البارتنر للشخص : <@${userId}>**`});
      await interaction.channel.send(`${SERVER_LINE}`);
  }
  else if (interaction.customId === 'partner-reject-reason') {
    const modal = new ModalBuilder()
      .setCustomId('partner-reject-reason-modal')
      .setTitle('سبب الرفض');

    const reasonInput = new TextInputBuilder()
      .setCustomId('reason')
      .setLabel('أدخل سبب الرفض')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
    await interaction.showModal(modal);
  }
}

else if (interaction.isModalSubmit() && interaction.customId === 'partner-reject-reason-modal') {
const disRow = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
    .setCustomId('partner-accept')
    .setLabel('✅ قبول')
    .setDisabled(true)
    .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
    .setCustomId('partner-reject')
    .setLabel('❌ رفض')
    .setDisabled(true)
    .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
    .setCustomId('partner-reject-reason')
    .setLabel('❌ رفض مع سبب')
    .setDisabled(true)
    .setStyle(ButtonStyle.Secondary)

    );
    
  await interaction.update({

     content: null,

     components: [disRow]

     });
    
    const uembed = interaction.message.embeds[0];
  const userId = uembed.fields
    .find(f => f.name.includes('ايدي الشخص'))
    .value.replace(/[<@>]/g, '');

  const user = await client.users.fetch(userId);
    
    const reason = interaction.fields.getTextInputValue('reason');
  await user.send({
    content: `<@${userId}>`, embeds: [new EmbedBuilder()
      .setTitle('❌ تم رفض طلبك في البارتنر')
      .setDescription(`سبب الرفض:\n ${reason}`)
      .setColor(`${EMBED_COLOR}`)
    ]
  }).catch(() => {});
  await interaction.reply({ content: 'تم إرسال سبب الرفض للمتقدم', ephemeral: true });
}
  
      
     
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "balance-modal") {
        let ended = false;

        const amount = +interaction.fields.getTextInputValue("amount");

        if (isNaN(amount))
          return interaction.reply({
            content: "✖️ **هـذا الـعـدد غـيـر صـحـيـح!**",
            ephemeral: true,
          });

        const price = Math.floor(
          amount *
            (interaction.member.roles.cache.has(MOZAA_ROLE)
              ? MOZAA_PRICE
              : BALANCE_PRICE)
        );
        const fullPrice = price === 1 ? 1 : Math.ceil(price / 0.95);

        const channel = client.channels.cache.get(TRANSACTIONS_CHANNEL);
        const embed = new EmbedBuilder()
          .setColor(`${EMBED_COLOR}`)
          .setTitle("الـرجـاء الـتـحـويـل لإكـمـال عـمـلـيـة الـشـراء")
          .setDescription(
            `\`\`\`#credit ${RECIPIENT_ID} ${fullPrice}\`\`\`\n**لـديـك 5 دقـائـق فـقـط لإكـمـال عـمـلـيـة الـتـحـويـل\nالـتـحـويـل يـكـون فـي روم ${channel}**`
          )
          .setTimestamp();

        const mention = await channel.send(`${interaction.user}`);
        setTimeout(() => mention.delete(), 2000);

        const msg = await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });

        await cooldowns.set(interaction.user.id, {
          messageId: msg.id,
        });

        const filter = (message) =>
          PROBOT_IDS.includes(message.author.id) &&
          message.content.includes(`${price}`) &
            message.content.includes(`${RECIPIENT_ID}`) &&
          message.content.includes(`${interaction.user.username}`);
        const pay = await channel.createMessageCollector({
          filter,
          max: 1,
          time: 3e5,
        });

        pay.once("collect", async (message) => {
          if (cooldowns.get(interaction.user.id)?.messageId !== msg.id) return;

          ended = true;
          const userData = await client.db.users.patch(interaction.user.id);

          userData.balance += amount;
          await userData.save();

          let embed = new EmbedBuilder()
            .setColor(`${EMBED_COLOR}`)
            .setTitle("تـم إكـمـال عـمـلـيـة الـشـراء بـنـجـاح !")
            .setTimestamp();

          msg.edit({
            embeds: [embed],
          });

          embed = new EmbedBuilder()
            .setTitle("تـم شـراء الـرصـيـد بـنـجـاح !")
            .setDescription(
              `**تـم شـراء \`${amount}\` رصـيـد بـنـجـاح، رصـيـدك الـحـالـي هـو: \`${userData.balance}\`**`
            )
            .setTimestamp();
          
          await interaction.user.send({ embeds: [embed] });
          
          embed = new EmbedBuilder()
            .setDescription(`** <#${FEEDBACK_CHANNEL_ID}> لا تـنـسـى تـقـيـيـمـنا مـن فـضـلـك**`)
            .setColor(`${EMBED_COLOR}`)
            .setTimestamp();
          
          await interaction.user.send({ embeds: [embed] });

          const clientsRole = message.guild.roles.cache.get(CLIENTS_ROLE);
          const superClientsRole = message.guild.roles.cache.get(SUPERCLIENTS_ROLE);
          const logChannel = client.channels.cache.get(BALANCE_LOG);

          if (clientsRole && amount < 500) {
            interaction.member.roles.add(clientsRole);
          }
          if (superClientsRole && amount >= 500) {
            interaction.member.roles.add(superClientsRole);
          }
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setColor(`${EMBED_COLOR}`)
              .setDescription(
                `**تـم شـراء \`${amount}\` رصـيـد بـواسـطـة: ${interaction.user}**`
              )
              .setTimestamp();

            logChannel.send({
              embeds: [embed],
            });
          }
        });

        pay.once("end", () => {
          if (cooldowns.get(interaction.user.id)?.messageId !== msg.id) return;

          cooldowns.delete(interaction.user.id);

          if (!ended) {
            const embed = new EmbedBuilder()
              .setColor(`${EMBED_COLOR}`)
              .setTitle("لـقـد انـتـهـى وقـت الـتـحـويـل !")
              .setTimestamp();

            msg.edit({
              embeds: [embed],
            });
          }
        });
      }
    }

    if (interaction.isButton() && interaction.customId === 'show-server-modal') {
      const modal = new ModalBuilder()
        .setCustomId('server-id-modal')
        .setTitle('إدخـال مـعـرف الـخـادم');

      const serverIdInput = new TextInputBuilder()
        .setCustomId('server-id')
        .setLabel('أدخـل مـعـرف الـخـادم:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(serverIdInput);
      modal.addComponents(row);

      await interaction.showModal(modal);
    }

    if (interaction.customId === 'server-id-modal') {
      const users = await client.db.users.Schema.find({
        accessToken: {
          $exists: true
        }
      });

      const guildID = interaction.fields.getTextInputValue('server-id');
      const guild = client.guilds.cache.get(guildID);

      if (!guild) return interaction.reply({
        content: '✖️ **لـم يـتـم الـعـثـور عـلـى الـخـادم. تـأكـد مـن إدخـال الـمـعـرف بـشـكـل صـحـيـح!**',
        ephemeral: true
      });

      await interaction.deferReply({ ephemeral: true });
      await guild.members.fetch();

      const filteredUsers = users.filter(user => !guild.members.cache.has(user.id));
      const availableUsers = filteredUsers.length;

      if (availableUsers === 0) return interaction.editReply({
        content: '✖️ **لا يـوجـد أعـضـاء يـمـكـن إضـافـتـهـم إلـى هـذا الـخـادم!**',
      });

      const userData = await client.db.users.patch(interaction.user.id);
      const balance = userData.balance;

      const canAddUsers = Math.min(availableUsers, balance);
      const unableToAdd = availableUsers - canAddUsers;

      const embed = new EmbedBuilder()
        .setColor(`${EMBED_COLOR}`)
        .setTitle(`🎯 **تـم فـحـص الـخـادم بـنـجـاح!**`)
        .setDescription(`
          ✅ **تـم الـعـثـور عـلـى ${availableUsers} عـضـو غـيـر مـوجـودين فـي الـخـادم**.
          
          🌐 **الـخـادم الـمـسـتـهـدف**: **${guild.name}**
          
          💰 **رصـيـدك الـحـالـي**: **${balance} 💎**
          
          📊 **تـفـاصـيـل عـمـلـيـة الإضـافـة**:

          - **عـدد الـأعـضـاء الـقـابـلـة للإضـافـة**: **${canAddUsers} عـضـو**

          - **عـدد الـأعـضـاء الـذيـن لا يـمـكـن إضـافـتـهـم بـسـبـب قـلـة الـرصـيـد**: **${unableToAdd} عـضـو**

          🔔 **مـلـحـوظـة هـامـة**:
          
          - إذا كـان عـدد الـأعـضـاء الـذيـن تـرغـب فـي إضـافـتـهـم أكـبـر مـن رصـيـدك، فـسـيـتـم إضـافـة الـأعـضـاء الـمـتـاحـين فـقـط حـسـب الـرصـيـد الـمـتـوافـر.
        `)
        .setThumbnail(guild.iconURL())
        .setFooter({ text: `تـم فـحـص الـخـادم بـواسـطـة ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.editReply({
        content: '✅ **تـم فـحـص الـخـادم بـنـجـاح!**',
        embeds: [embed],
      });
    }

    if (interaction.customId === 'members-modal') {
      const users = await client.db.users.Schema.find({
        accessToken: {
          $exists: true
        }
      });

      const amount = interaction.fields.getTextInputValue('amount').toLowerCase() === 'all' ? users.length : +interaction.fields.getTextInputValue('amount');
      const guildID = interaction.fields.getTextInputValue('id');
      const guild = client.guilds.cache.get(guildID);

      if (isNaN(amount)) return interaction.reply({
        content: '✖️ **هـذا الـعـدد غـيـر صـحـيـح!**',
        ephemeral: true
      });

      const userData = await client.db.users.patch(interaction.user.id);

      if (amount > users.length) return interaction.reply({
        content: `✖️ **هـذا الـعـدد غـيـر مـتـوافـر! الـمـتـوافـر الـآن ${users.length}**`,
        ephemeral: true
      });

      if (!guild) return interaction.reply({
        content: '✖️ **يـجـب أولاً إدخـال الـبـوت إلـى هـذا الـخـادم!**',
        ephemeral: true
      });

      if (amount < MIN_MEMBERS) return interaction.reply({
        content: `✖️ **عـذراً، ولـكـن أقـل عـدد لـلـشـراء هـو ${MIN_MEMBERS} عـضـو!**`,
        ephemeral: true
      });

      await interaction.deferReply({
        ephemeral: true
      });
      await guild.members.fetch();

      const filteredUsers = users.filter((user) => !guild.members.cache.get(user.id));
      
      if (filteredUsers.length < amount) return interaction.editReply({
        content: `✖️ **لا يـوجـد عـدد كـافٍ مـن الـأعـضـاء لإضـافـتـهـم. الـمـتـاح الـآن هـو ${filteredUsers.length}.**`
      });

      const membersToAdd = filteredUsers.slice(0, amount);

      if (amount > userData.balance) return interaction.editReply({
        content: '✖️ **لـيـس لـديـك رصـيـد كـافـي!**',
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`join-${guild.id}-${amount}`)
          .setStyle(ButtonStyle.Success)
          .setLabel('إدخـال الـأعـضـاء'),
        new ButtonBuilder()
          .setCustomId('cancel-m')
          .setStyle(ButtonStyle.Danger)
          .setLabel('إلـغـاء')
      );

      const msg = await interaction.editReply({
        content: `${guild.name}\n\n**تـم إيـجـاد ${filteredUsers.length} عـضـو غـيـر مـوجـودين فـي الـخـادم**.\nهـل أنـت مـتـأكـد أنـك تـريـد إدخـال ${amount} عـضـو؟`,
        components: [row]
      });

      mCooldowns.set(interaction.user.id, {
        messageId: msg.id,
        members: membersToAdd
      });

      setTimeout(() => {
        mCooldowns.delete(interaction.user.id);
      }, 3e5);
    }
  },
};