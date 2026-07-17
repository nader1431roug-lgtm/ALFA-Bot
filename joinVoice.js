const { PermissionFlagsBits } = require('discord.js');

const {

  joinVoiceChannel,

  getVoiceConnection,

  VoiceConnectionStatus,

  entersState

} = require('@discordjs/voice');

module.exports = {

  name: 'joinvoice',

  aliases: ['jv'],
  
  owners: true,

  async execute(message, args, client) {

    const channel = message.mentions.channels.first();

    if (!channel || channel.type !== 2) {

      return message.reply({ content: '❌ منشن روم صوتي صحيح' });

    }

    // ==== تشيك الادمن أو صاحب السيرفر (نفس السلاش) ====

    if (

      !message.member.permissions.has(PermissionFlagsBits.Administrator) &&

      message.guild.ownerId !== message.author.id

    ) {

      return message.reply({

        content: '❌ انت مش ادمن أو صاحب السيرفر عشان تستخدم الأمر'

      });

    }

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

        console.error('❌ خطأ في دخول الروم الصوتي:', err);

        return null;

      }

    };

    let connection = await connect();

    if (!connection) {

      return message.reply({ content: '❌ فشل في دخول الروم الصوتي' });

    }

    await message.reply({

      content: `✅ دخلت الروم الصوتي: **${channel.name}**`

    });

    // ==== نفس حل voiceIntervals ====

    if (!client.voiceIntervals) {

      client.voiceIntervals = new Map();

    }

    // ==== تنظيف أي interval قديم ====

    if (client.voiceIntervals.has(message.guild.id)) {

      clearInterval(client.voiceIntervals.get(message.guild.id));

    }

    // ==== auto-reconnect (نفس السلاش) ====

    const interval = setInterval(async () => {

      try {

        let conn = getVoiceConnection(message.guild.id);

        if (!conn || conn.state.status === VoiceConnectionStatus.Destroyed) {

          connection = await connect();

        } else if (conn.joinConfig.channelId !== channel.id) {

          conn.destroy();

          connection = await connect();

        }

      } catch (err) {

        console.error('❌ خطأ أثناء auto-reconnect:', err);

      }

    }, 5000);

    client.voiceIntervals.set(message.guild.id, interval);

  },

};