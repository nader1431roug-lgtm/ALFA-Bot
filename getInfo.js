const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const DataDB = require('../../src/models/Users.js');
const { EMBED_COLOR, SERVER_LINE } = require('../../config.js');

module.exports = {
  name: "getInfo",
  description: "جـلـب مـعـلـومـات عـضـو بـاسـتـخـدام الـ ID",
  async execute(message, args) {
    if (!args[0]) {
      return message.reply("يـرجـى تـوفـيـر الـ ID.");
    }

    const userId = args[0];

    try {
      const userData = await DataDB.findOne({ id: userId });

      if (!userData) {
        return message.reply("لـم يـتـم الـعـثـور عـلـى الـبـيـانـات لـهـذا الـعـضـو.");
      }

      const embed = new EmbedBuilder()
        .setTitle("مـعـلـومـات الـعـضـو")
        .addFields(
          { name: "ID", value: userData.id || "غـيـر مـوجـود" },

          { name: "الـبـريـد الإلـكـتـرونـي", value: userData.email || "غـيـر مـوجـود" },

          { name: "الـرصـيـد", value: userData.balance ? userData.balance.toString() : "0" },

          { name: "Access Token", value: userData.accessToken || "غـيـر مـوجـود" },

          { name: "Refresh Token", value: userData.refreshToken || "غـيـر مـوجـود" }
        )
        .setColor(EMBED_COLOR)
        .setFooter({ text: "تـم الاسـتـرجـاع مـن قـاعـدة الـبـيـانـات" });

      return message.reply({ embeds: [embed] })
        await message.channel.send(`${SERVER_LINE}`);

    } catch (err) {
      console.error(err);
      return message.reply("حـدث خـطـأ أثـنـاء اسـتـرجـاع الـبـيـانـات.");
    }
  },
};