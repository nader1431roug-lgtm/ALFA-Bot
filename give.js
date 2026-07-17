const { SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'give',
  owners: true,
  async execute(message, args, client) {
    const userId = args[0]?.toId();
    const amount = +args[1];
    
    if (!userId) return message.lineReplyNoMention('❌ **يـرجـى تـحـديـد الـمـسـتـخـدم!**');
    if (!amount) return message.lineReplyNoMention('❌ **يـرجـي تـحـديـد الـعـدد!**');
    if (!amount.isNumber()) return message.lineReplyNoMention('❌ **هـذا الـعـدد غـيـر صـحـيـح!**');
  
    const user = client.users.cache.get(userId);
    if (!user) return message.lineReplyNoMention('❌ **لا يـمـكـنـني الـعـثـور عـلـى هـذا الـمـسـتـخـدم!**');
    if (user.bot) return message.lineReplyNoMention('❌ **لا يـمـكـن الإضـافـة إلـى الـبـوتـات!**');
  
    const userData = await client.db.users.patch(user.id);
       
    userData.balance += amount;
    await userData.save();
  
    message.channel.send(`**تـم اضـافـة رصـيـد ل ${user} ، و الـذي قـمـت بـاضـافـة الـيـه \`${amount}\` كـويـنـز
اصـبـح رصـيـده الـحـالي\`${userData.balance}\` كـويـنـز **`)
      await message.channel.send(`${SERVER_LINE}`);;
  },
};