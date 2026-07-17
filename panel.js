const { EmbedBuilder, ActionRowBuilder,StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

const bannerData = {
  imageUrl: 'https://i.postimg.cc/gcC4TCfJ/Untitled36-20260101133753.png',
};
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
  name: 'panel',
  owners: true,
 async execute(message, args, client) {
    const subCommand = args[0];

    if (subCommand === 'img') {
      const imageUrl = args[1];

      if (!imageUrl) {
        return message.reply('يـرجـى تـوفـيـر رابـط الـصـورة.');
      }

      bannerData.imageUrl = imageUrl;
      return message.reply('تـم تـحـديـث الـصـورة بـنـجـاح !!!');
    } else {
      const embed = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setTitle(` | شراء اعضاء`)
        .setImage("https://i.postimg.cc/LXXrDqvy/Untitled62-20260124080345.png")
        .setDescription(`ㅤ`)
      .setColor(EMBED_COLOR)
        .setTimestamp();
      

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket')
          .setLabel('فـتـح تـذكـرة')
          
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('server-id')
          .setLabel('ايـدي الـخـادم')
          
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setLabel('اضــافـة الـبـوت')
          
          .setURL(BOT_URL)
          .setStyle(ButtonStyle.Link),
      );
  const row2 = new ActionRowBuilder().addComponents(
   new StringSelectMenuBuilder()
      .setCustomId('buy-panel-select')
      .setPlaceholder('اختر الحاجه ال انت مش فاهمها ؟')
      .addOptions(
          {
              label: 'ازاي اضيف البوت للسيرفر؟',
              value: 'how to add bot to the server'
              },
          {
              label: 'ايه فايدة بوت الفحص ؟',
              value: 'فايدة بوت الفحص'
              },
          {
              label: 'ازاي اشتري اعضاء من السيرفر ؟',
              value: 'how to buy'
              },
          {
              label: 'كم عضو في الستوك ؟ ',
              value: 'how much stock'
              },
          {
          label: 'ما دخلي كل الاعضاء ابي تعويض',
              value: 'ta3weed'
              },
          {
              label: 'ليش ما يدخل كل الاعضاء ؟',
              value: 'قيود ديسكورد'
              }
          )
      );
        
      message.channel.send({ embeds: [embed], components: [row, row2] });
        await message.channel.send(`${SERVER_LINE}`);
      message.delete();
  
    }
  },
};