module.exports = {
  name: 'take',
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
   
    if (amount > userData.balance) return message.lineReplyNoMention('❌ **لا يـمـكـن خـصـم عـدد اكـبـر مـن رصـيـده!**');
    
    userData.balance -= amount;
    await userData.save();
  
    message.channel.send(`✅ **تـم بـنـجـاح! خـصـم \`${amount}\`كـويـنـز  مـن ${user}\nرصـيـده الان هـو \`${userData.balance}\` كـويـنـز **`);
  },
};