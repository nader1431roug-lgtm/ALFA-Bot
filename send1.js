const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: 'bnod',
  description: "ارسال ايمبد بنود السيرفر",
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setImage("https://i.postimg.cc/pV8t6jPx/Untitled62-20260123225930.png")
    
      .setDescription(
        `**1- عملية البيع تلقائية 100% , لا تستني احد يجي يبيعلك او يساعدك.

2- قيامك بتحويل قيمه اقل من المطلوبه مسؤوليتك الشخصيه ولا يوجد تعويض.

3- قيامك بتحويل القيمه المطلوبه الي حساب خطأ مسؤوليتك الشخصيه ولا يوجد تعويض.

4- الستوك مايدخل كل الاعضاء بسبب سياسات الديسكورد , ولكن نضمن دخول 50-60%.

5- يتم تعويضك فقط اذا قمت بشراء 200 عضو وفوق.

6- شاري من قبل و تعيد تشتري لنفس سيرفر لي شريت فيه = لايوجد تعويض.**`
      )
     .setColor(EMBED_COLOR) // لون أسود
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('english_embed') // معرّف الزر
        .setLabel('English')
        .setStyle(ButtonStyle.Secondary) // زر اسود
    );

    await message.channel.send({
      embeds: [embed],
      components: [row],
    })
      await message.channel.send(`${SERVER_LINE}`);
  },
};