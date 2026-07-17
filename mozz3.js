
const { EmbedBuilder } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'mozz3',
  owners: true,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('يـرجـى وضـع ايـدي رول الـمـوزعـيـن');
    }

    const role = parseInt(args[0]);

    const fs = require('fs');
    const path = './config.js';
    const configContent = fs.readFileSync(path, 'utf-8');
    const updatedConfigContent = configContent.replace(
      /MOZZ3_ROLE_ID: \d+,/,
      `MOZZ3_ROLE_ID: ${role},`
    );
    fs.writeFileSync(path, updatedConfigContent);

    const embed = new EmbedBuilder()
      .setDescription(`تـم تـغـيـيـر ايـدي رول الـمـوزعـيـن إلـى \`${role}\`
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
