const { EmbedBuilder } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'client',
  owners: true,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('يـرجـى وضـع ايـدي رول الـعـمـيـل.');
    }

    const newClientsRole = args[0];

    const fs = require('fs');
    const path = './config.js';
    const configContent = fs.readFileSync(path, 'utf-8');
      const updatedConfigContent = configContent.replace(
      /CLIENTS_ROLE: '(.*)',/,
      `CLIENTS_ROLE: '${newClientsRole}',`
    );

    fs.writeFileSync(path, updatedConfigContent);

    const embed = new EmbedBuilder()
      .setDescription(`تـم تـغـيـير رول الـعـمـلاء إلـى \`${newClientsRole}\`
يـرجـى الانـتـظـار الـى ان بـوت يـقـوم بـعـمـل ريـسـتـارت     `)

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