
const { EmbedBuilder } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');


module.exports = {
  name: 'log',
  owners: true,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('يـرجـى وضـع ايـدي روم الـلـوغ');
    }

    const newLogChannelId = args[0];

    const fs = require('fs');
    const path = './config.js';
    const configContent = fs.readFileSync(path, 'utf-8');
    const updatedConfigContent = configContent.replace(
      /BALANCE_LOG: '(.*)',/,
      `BALANCE_LOG: '${newLogChannelId}',`
    );

    const updatedConfigContentWithDoneChannel = updatedConfigContent.replace(
      /DONE_CHANNEL: '(.*)',/,
      `DONE_CHANNEL: '${newLogChannelId}',`
    );

    fs.writeFileSync(path, updatedConfigContentWithDoneChannel);

    const embed = new EmbedBuilder()
      .setDescription(`تـم تـغـيـيـر روم الـلـوغ إلـى \`${newLogChannelId}\`
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
