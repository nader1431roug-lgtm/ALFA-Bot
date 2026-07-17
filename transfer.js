module.exports = {
    name: 'transfer',
    owners: true,
    async execute(message, args, client) {
      if (!args[0]) {
        return message.reply('يـرجـى وضـع ايـدي روم الـتـحـويـلات.');
      }
      const newTransferChannel = args[0];
  
      const fs = require('fs');
      const path = './src/Constants.js';
      const configContent = fs.readFileSync(path, 'utf-8');
      const updatedConfigContent = configContent.replace(
        /TRANSACTIONS_CHANNEL: '(.*)',/,
        `TRANSACTIONS_CHANNEL: '${newTransferChannel}',`
      );
      fs.writeFileSync(path, updatedConfigContent);
  
      message.channel.send(`تـم تـغـيـير ايـدي روم الـتـحـويـلات الـى \`${newTransferChannel}\``);
    },
  };