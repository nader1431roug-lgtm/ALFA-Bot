const ms = require('ms');
const cooldowns = new Map();

module.exports = {
  name: 'boost',
  async execute(message, args, client) {
    const userId = message.author.id;
    const user = client.users.cache.get(userId);

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId);
      const remainingTime = expirationTime - Date.now();

      if (remainingTime > 0) {
        const remainingTimeString = ms(remainingTime);
        return message.lineReplyNoMention(`يـرجـى اسـتـعـمـال هـاذا الأمـر فـي الأسـبـوع الـثـانـي.`);
      }
    }

    const cooldownTime = ms('7d');
    const requiredRoleName = 'Server Booster';

    const member = message.guild.members.cache.get(userId);

    if (!member || !member.roles.cache.some(role => role.name === requiredRoleName)) {
      return message.lineReplyNoMention(`**انـت لـم تـعـمـل بـوسـت لـلسـيـرفـر!**`);
    }

    const userData = await client.db.users.patch(user.id);

    userData.boostCount = (userData.boostCount || 0) + 1;
    const boostAmount = 15; // Change the reward to 100

    cooldowns.set(userId, Date.now() + cooldownTime);

    userData.balance += boostAmount;
    userData.lastBoostTime = new Date().toISOString();
    await userData.save();

    message.channel.send(`**تـم إضـافـة ${boostAmount} كـويـنـز إلـى حـسـابـك بـنـجـاح  !**`);
  },
};