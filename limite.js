const { EmbedBuilder } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'limite',
  owners: true,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('يـرجـى وضـع عـدد');
    }

    const newMIN_MEMBERS = args[0];

    const fs = require('fs');
    const path = './config.js';
    const configContent = fs.readFileSync(path, 'utf-8');
    const updatedConfigContent = configContent.replace(
      /MIN_MEMBERS: \d+,/,
      `MIN_MEMBERS: ${newMIN_MEMBERS},`
    );

    fs.writeFileSync(path, updatedConfigContent);

    const embed = new EmbedBuilder()
      .setDescription(`تـم تـغـيـير اقـل عـدد لـلـشـراء إلـى \`${newMIN_MEMBERS}\`
يـرجـى الانـتـظـار الـى ان بـوت يـقـوم بـعـمـل ريـسـتـارت     `)
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
      });
  },
};