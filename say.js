const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

const {
  PREFIX,
  BALANCE_PRICE,
  TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  MAIN_SERVER_ID,
  ATHBET_NAFSEK_LOG,
  MONGOOSE,
  BALANCE_LOG,
  STOCK_CHANNEL, 
  STOCK_MESSAGE,
  CLIENTS_ROLE, 
  DONE_CHANNEL, 
  SUPERCLIENTS_ROLE, 
  MIN_MEMBERS,
  MOZAA_PRICE,
REDIRECT_URI,
  RECIPIENT_ID,
  MOZAA_ROLE, 
  TRANSACTIONS_CHANNEL,
  TAX_CHANNEL, 
  supprt,
  logs,
  AUTH_URL,
  BOT_URL,
  PROBOT_IDS, 
  OWNERS,
} = require('../../config.js');

module.exports = {

  name: 'say',

  owners: true,

  async execute(message, args, client) {

   // حذف رسالة الامر فورا 
      
await message.delete();
      
      
    // لو مفيش كلام

    if (!args.length) {

      return message.reply('❌ لازم تكتب كلمة مع الأمر');

    }

    const content = args.join(' ');

    const row = new ActionRowBuilder().addComponents(

      new ButtonBuilder()

        .setCustomId('say_everyone')

        .setLabel('everyone')

        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()

        .setCustomId('say_here')

        .setLabel('here')

        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()

        .setCustomId('say_without')

        .setLabel('Without')

        .setStyle(ButtonStyle.Secondary),

    );

    const msg = await message.channel.send({

      content: 'اختار طريقة الإرسال 👇',

      components: [row],

    });

    const filter = (i) =>

      i.user.id === message.author.id;

    const collector = msg.createMessageComponentCollector({

      filter,

      time: 10000, // 10 ثواني

    });

    collector.on('collect', async (interaction) => {

      await interaction.deferUpdate();

      let finalMessage = content;

      if (interaction.customId === 'say_everyone') {

        finalMessage = `-# **||\@everyone||**\n ${content}`;

      } else if (interaction.customId === 'say_here') {

        finalMessage = `-# **||\@here||**\n ${content}`;

      }

      await msg.delete().catch(() => {});

      await message.channel.send({ content: finalMessage });

      collector.stop();

    });

    collector.on('end', async (collected) => {

      if (collected.size === 0) {

        await msg.delete().catch(() => {});

      }

    });

  },

};