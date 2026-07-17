const boxSystem = require('../../src/managers/boxSystem');

module.exports = {
  name: 'bopen',
  owners: true,
  async execute(message, args, client) {
    if (!boxSystem.start(client))
      return message.reply('📦 البوكسات شغالة أصلًا');

    message.reply('✅ تم تشغيل البوكسات الأوتوماتيك');
  }
};