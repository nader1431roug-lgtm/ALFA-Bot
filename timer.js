const { EmbedBuilder } = require('discord.js');
const { EMBED_COLOR } = require('../../config.js');
const ms = require('ms');

function formatTime(msTime) {
  const s = Math.floor((msTime / 1000) % 60);
  const m = Math.floor((msTime / (1000 * 60)) % 60);
  const h = Math.floor((msTime / (1000 * 60 * 60)) % 24);
  const d = Math.floor(msTime / (1000 * 60 * 60 * 24));

  return `${d ? `${d} يوم ` : ''}${h ? `${h} ساعة ` : ''}${m ? `${m} دقيقة ` : ''}${s} ثانية`.trim();
}

module.exports = {
  name: 'timer',
  async execute(message, args) {
    if (!args[0])
      return message.reply('❌ اكتب الوقت مثال: `10s` `5m` `1d`');

    const timeArg = args[0].toLowerCase();

    if (!timeArg.endsWith('s') && !timeArg.endsWith('m') && !timeArg.endsWith('d'))
      return message.reply('❌ يرجى استخدام الاختصارات الصحيحة: s / m / d');

    const totalTime = ms(timeArg);
    if (!totalTime) return message.reply('❌ صيغة الوقت غير صحيحة');

    let remaining = totalTime;
    const endTime = Date.now() + totalTime;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true })
      })
      .setTitle(args[1] || '⏱️ Timer Started')
      .setColor(`${EMBED_COLOR}`)
      .setDescription(`**الوقت المتبقي:**\n\`${formatTime(remaining)}\``)
      .addFields(
        { name: '👤 صاحب التايمر', value: `${message.author}`, inline: true },
        { name: '📌 الحالة', value: '⏳ جاري العد', inline: true }
      )
      .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });

    const interval = setInterval(async () => {
      remaining = endTime - Date.now();

      if (remaining <= 0) {
        clearInterval(interval);
          
   const endEmbed = new EmbedBuilder()
   .setTitle('📛 Time Out')
   .setDescription('تم انتهاء الوقت المحدد للتايمر')
    .setFields(
        { name: '👤 صاحب التايمر', value: `${message.author}`, inline: true },
        { name: '📌 الحالة', value: 'تم الانتهاء 📛', inline: true }
      )
          
      return message.channel.send({
          content: `Timed out ! , ${message.author}`,
          embeds: [endEmbed]
          });
      }

      embed
        .setDescription(`**الوقت المتبقي:**\n\`${formatTime(remaining)}\``)
        .setFields(
          { name: '👤 صاحب التايمر', value: `${message.author}`, inline: true },
          { name: '📌 الحالة', value: '⏳ جاري العد', inline: true }
        );

      await msg.edit({ embeds: [embed] });
    }, 500); // تحديث كل 3 ثانية
  }
};