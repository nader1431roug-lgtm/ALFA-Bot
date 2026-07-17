const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const usersData = require('../../src/models/Users.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'coins',
  async execute(message, args, client) {
    const targetUser = message.mentions.users.first() || message.author;

    if (!targetUser) return message.reply('❌ **هـذا الـمـسـتـخـدم غـيـر مـوجـود!**');
    if (targetUser.bot) return message.reply('❌ **الـبـوتـات لا تـمـلـك أرصـدة!**');

    const senderData = await usersData.findOne({ id: message.author.id }) || new usersData({ id: message.author.id });
    const receiverData = await usersData.findOne({ id: targetUser.id }) || new usersData({ id: targetUser.id });

    const transferAmount = args[1] ? parseInt(args[1], 10) : null;

    if (transferAmount && !isNaN(transferAmount)) {
      if (transferAmount <= 0) return message.reply('❌ **يـرجـى تـحـديـد مـبـلـغ صـحـيـح لـلـتـحـويـل.**');
      if (senderData.balance < transferAmount) return message.reply('❌ **رصـيـدك غـيـر كـافـٍ لإجـراء هـذا الـتـحـويـل.**');

      senderData.balance -= transferAmount;
      receiverData.balance += transferAmount;

      await senderData.save();
      await receiverData.save();

      return message.reply(`✅ **تـم تـحـويـل ${transferAmount} كـويـنـز إلـى <@${targetUser.id}> بـنـجـاح!**`);
    }

    let replyMessage = targetUser.id === message.author.id
      ? `**رصـيـدك الـحـالي هـو ${senderData.balance} كـويـنـز.**`
      : `**رصـيـد ${targetUser.username} هـو ${receiverData.balance} كـويـنـز.**`;

    let components = [];
    if (targetUser.id === message.author.id && senderData.balance === 0) {
      replyMessage = `**لـيـس لـديـك أي رصـيـد حـاليـاً.**\nإذا كـنـت تـرغـب فـي شـراء رصـيـد، اضـغـط عـلـى الـزر أدنـاه.`;

      components = [new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel('شـراء رصـيـد')
          .setCustomId('buy-balance')
           
      )];
    }

    message.reply({ content: replyMessage, components });
  },
};