const { EmbedBuilder } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'price',
  owners: true,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('يـرجـى وضـع سـعـر لـلـكـويـنـز');
    }

    const newBalancePrice = parseInt(args[0]);

    const fs = require('fs');
    const path = './config.js';
    const configContent = fs.readFileSync(path, 'utf-8');
    const updatedConfigContent = configContent.replace(
      /BALANCE_PRICE: \d+,/,
      `BALANCE_PRICE: ${newBalancePrice},`
    );
    fs.writeFileSync(path, updatedConfigContent);

    const embed = new EmbedBuilder()
      .setDescription(`تـم تـغـيـيـر سـعـر الـكـويـنـز إلـى \`${newBalancePrice}\`
يـرجـى الـانـتـظـار إلـى أن يـقـوم الـبـوت بـعـمـل ريـسـتـارت`)
      .setColor(EMBED_COLOR)

    message.channel.send({ embeds: [embed] })
      .then(() => {
        process.on('exit', () => {
          require('child_process').spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached: true,
            stdio: 'inherit'
          });
        });
        process.exit();
      })
      await message.channel.send(`${SERVER_LINE}`);
  },
};
