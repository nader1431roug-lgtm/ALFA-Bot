module.exports = {
  name: 'unmuteall',
  description: 'Remove voice and text mute for all members in the server',
  owners: true,
  async execute(message, args, client) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('❌ **لـيـس لـديـك صـلاحـيـة اسـتـخـدام هـذا الأمـر!**');
    }

    const guild = message.guild;

    if (!guild) {
      return message.reply('❌ **هـذا الأمـر يـعـمـل فـقـط داخـل الـسـيـرفـر!**');
    }

    let processedCount = 0;

    const members = await guild.members.fetch();

    const messageProgress = await message.channel.send('⏳ **جـاري إزالـة الـمـيـوت عـن الأعـضـاء...**');
    for (const member of members.values()) {
      if (member.voice.serverMute) {
        await member.voice.setMute(false).catch((err) => console.error(`Failed to unmute voice for ${member.user.tag}:`, err));
      }

      if (member.isCommunicationDisabled()) {
        await member.timeout(null).catch((err) => console.error(`Failed to unmute text for ${member.user.tag}:`, err));
      }

      processedCount++;
      if (processedCount % 10 === 0) {
        await messageProgress.edit(`⏳ **تـم مـعـالـجـة ${processedCount}/${members.size} عـضـوًا...**`);
      }
    }

    await messageProgress.edit(`✅ **تـمـت إزالـة الـمـيـوت عـن الـجـمـيـع بـنـجـاح!**`);
  },
};