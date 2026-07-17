const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState, getVoiceConnection } = require('@discordjs/voice');
const { voice_channel_id, EMBED_COLOR, SERVER_LINE } = require('../../config.js')

module.exports = {
  name: 'jvd',
  owners: true,
  description: 'دخول روم صوتي ثابت بعد التأكيد',
  async execute(message, args, client) {
    // روم ثابت
    const channelId = `${voice_channel_id}` ;
    const channel = await client.channels.fetch(channelId);

    if (!channel || channel.type !== 2) {
      return message.reply({ content: '❌ الروم الصوتي غير موجود أو خطأ في النوع' });
    }

    const embed = new EmbedBuilder()
      .setTitle('دخول الروم الصوتي')
      .setDescription(`🔄 **هـل تـريـد بـالـتـأكـيـد أن البوت يدخل الروم الصوتي: ${channel.name}? اضغط الزر أدناه للتأكيد.**`)
      .setColor('FFFF00')
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirm-jvd')
        .setLabel('تأكيد الدخول الروم')
        .setStyle(ButtonStyle.Success)
    );

    const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

    const filter = (interaction) => interaction.customId === 'confirm-jvd' && interaction.user.id === message.author.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async (interaction) => {
      await interaction.update({ components: [] });

      const connect = async () => {
        try {
          const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false,
          });

          await entersState(connection, VoiceConnectionStatus.Ready, 10000);
          return connection;
        } catch (err) {
          console.error('❌ خطأ في دخول الروم الصوتي ($jvd):', err);
          return null;
        }
      };

      const connection = await connect();
      if (!connection) {
        return message.channel.send({ content: '❌ فشل في دخول الروم الصوتي' });
      }

      const successEmbed = new EmbedBuilder()
        .setTitle('✅ دخل البوت الروم الصوتي')
        .setDescription(`🎧 الروم الصوتي: **${channel.name}**`)
        .setColor('#00ff00')
        .setTimestamp();

      await message.channel.send({ embeds: [successEmbed] });

      // ==== auto-reconnect لو خرج البوت من الروم ====
      if (!client.voiceIntervals) client.voiceIntervals = new Map();
      if (client.voiceIntervals.has(message.guild.id)) {
        clearInterval(client.voiceIntervals.get(message.guild.id));
      }

      const interval = setInterval(async () => {
        try {
          const conn = getVoiceConnection(message.guild.id);
          if (!conn || conn.state.status === VoiceConnectionStatus.Destroyed) {
            await connect();
          }
        } catch (err) {
          console.error('❌ خطأ أثناء auto-reconnect:', err);
        }
      }, 5000);

      client.voiceIntervals.set(message.guild.id, interval);
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        sentMessage.edit({ content: '❌ **لـم يتم التأكيد، تم إلغاء دخول الروم الصوتي.**', components: [] });
      }
    });
  },
};