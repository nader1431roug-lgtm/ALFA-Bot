module.exports = {
    name: 'taxid',
    owners: true,
    async execute(message, args, client) {
      if (!args[0]) {
        return message.reply('يـرجـى وضـع ايـدي روم الـضـريـبـه .');
      }
      const newTaxChannel = args[0];
  
      const fs = require('fs');
      const path = './src/Constants.js';
      const configContent = fs.readFileSync(path, 'utf-8');
      const updatedConfigContent = configContent.replace(
        /TAX_CHANNEL: '(.*)',/,
        `TAX_CHANNEL: '${newTaxChannel}',`
      );
      fs.writeFileSync(path, updatedConfigContent);
  
      message.channel.send(`تـم تـغـيـير ايـدي روم الـضـريـبـه  الـى \`${newTaxChannel}\` `);
    },
  };