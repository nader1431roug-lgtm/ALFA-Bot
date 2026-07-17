const boxSystem = require('../../src/managers/boxSystem');

module.exports = {

  name: 'bclose',
    
  owners: true,

  async execute(message) {

    if (!boxSystem.stop())

      return message.reply('❌ البوكسات مش شغالة');

    message.reply('🛑 تم إيقاف نظام البوكسات');

  }

};