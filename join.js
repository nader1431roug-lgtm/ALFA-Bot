const { EmbedBuilder } = require('discord.js');
const usersData = require('../../src/models/Users.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

const blacklist = ["", "SERVER_ID_2", "SERVER_ID_3"];

module.exports = {
  name: 'join',
  owners: true,
  async execute(message, args, client) {
    const users = await usersData.find({accessToken: {$exists: true}});
    const guildId = args[0];
    const guild = client.guilds.cache.get(guildId);
    const count = args[1]?.toLowerCase() === 'all' ? users.length : +args[1];

    if (!guildId) return message.lineReplyNoMention('قـم بـوضـع ايـدي الـخـادم .');
    if (blacklist.includes(guildId)) return message.lineReplyNoMention('❌ **هـذا الـخـادم مـحـظـور ولا يـمـكـن إضـافـة الأعـضـاء إلـيـه.**');
    if (!guild) return message.lineReplyNoMention('لـم اسـتـطـيـع الـتـعـرف عـلـى الـخـادم .');
    if (!count) return message.lineReplyNoMention('قـم بـتـحـديـد الـعـدد .');
    if (!Number.isFinite(count)) return message.lineReplyNoMention('قـم بـوضـع عـدد الأعـضـاء .');
    if (count > users.length) return message.lineReplyNoMention(`كـمـيـة تـفـوق الـتـي تـتـواجـد بـالـمـخـزون ${users.length} .`);

    let done = 0;
    let failed = 0;
    let already = 0;

    const updateMessage = await message.channel.send(`**جـاري إدخـال الأعـضـاء إلـى خـادم ${guild.name} (مـعـرف: ${guildId}) ...**`);

    const interval = setInterval(() => {
      updateMessage.edit(`**جـاري إدخـال الأعـضـاء إلـى خـادم ${guild.name} (مـعـرف: ${guildId}) ...\n✅ تـم إدخـال ${done} عـضـو\n❌ فـشـل إدخـال ${failed} عـضـو**`);
    }, 5000);

    for (let i = count - 1; i >= 0; i--) {
      const userId = users[i].id;
      const accessToken = users[i].accessToken;
      const members = guild.members;

      if (members.cache.get(userId)) {
        already++;
        continue;
      }

      try {
        await members.add(userId, {
          accessToken,
        });
        done++;
      } catch {
        failed++;
      }
    }

    clearInterval(interval);
    updateMessage.edit(`**تـم إدخـال الأعـضـاء إلـى خـادم ${guild.name} (مـعـرف: ${guildId}) ...\n✅ تـم إدخـال ${done} عـضـو\n❌ لـم اتـمـكـن مـن إدخـال ${failed} عـضـو**`)
      await message.channel.send(`${SERVER_LINE}`);
    message.channel.send('✅ **تـمـت الـعـمـلـيـة بـنـجـاح!**');
  },
};