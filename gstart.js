const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PREFIX } = require('../../config.js');

// تحويل المدة من النص لثواني
function parseDuration(input) {
    const match = input.match(/^(\d+)(s|m|h)$/i);
    if (!match) return null;
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === 's') return value;
    if (unit === 'm') return value * 60;
    if (unit === 'h') return value * 60 * 60;
    if (unit === 'd') return value * 60 * 60 * 24;
    return null;
}

module.exports = {
    name: 'gstart',
    owners: true,
    async execute(message, args, client) {
        if (args.length < 3) {
            return message.reply(`❌ الاستخدام: \`${PREFIX}gstart <مدة> <عدد الفائزين> <الجائزة>\``);
        }

        const duration = parseDuration(args[0]);
        if (!duration || duration <= 0) return message.reply('❌ مدة غير صالحة! مثال: 30s, 5m, 1h');

        const winnersCount = parseInt(args[1]);
        if (isNaN(winnersCount) || winnersCount < 1) return message.reply('❌ عدد الفائزين غير صالح!');

        const prize = args.slice(2).join(' ');

        const embed = new EmbedBuilder()
            .setTitle(`🎉 جائزة: ${prize}`)
            .addFields(
                { name: 'عدد الفائزين', value: `${winnersCount}`, inline: true },
                { name: 'مدة الجيفاواي', value: `${args[0]}`, inline: true }
            )
            .setColor('DarkBlue')
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('enter_giveaway')
                .setLabel('شارك الآن!')
                .setStyle(ButtonStyle.Primary)
        );

        const giveawayMessage = await message.channel.send({ embeds: [embed], components: [row] });

        // تسجيل الجيفاواي في الذاكرة
        if (!client.giveaways) client.giveaways = new Map();
        client.giveaways.set(giveawayMessage.id, {
            prize,
            winnersCount,
            endTime: Date.now() + duration * 1000,
            participants: new Set()
        });

        message.reply(`✅ تم بدء الجيفاواي بنجاح!`).then(msg => setTimeout(() => msg.delete(), 5000));

        // انتهاء الجيفاواي بعد المدة
        setTimeout(async () => {
            const giveaway = client.giveaways.get(giveawayMessage.id);
            if (!giveaway) return;

            const participantsArray = Array.from(giveaway.participants);
            let winners = [];

            if (participantsArray.length > 0) {
                while (winners.length < giveaway.winnersCount && participantsArray.length > 0) {
                    const winnerIndex = Math.floor(Math.random() * participantsArray.length);
                    winners.push(participantsArray.splice(winnerIndex, 1)[0]);
                }
            }

            const endEmbed = new EmbedBuilder()
                .setTitle(`🏆 انتهى الجيفاواي: ${prize}`)
                .addFields(
                    { name: 'عدد الفائزين', value: `${giveaway.winnersCount}`, inline: true },
                    { name: 'الفائزون', value: winners.length > 0 ? winners.map(u => `<@${u}>`).join(', ') : 'لا أحد فاز 😢' }
                )
                .setColor('Green')
                .setTimestamp();

            await giveawayMessage.edit({ embeds: [endEmbed], components: [] });
            client.giveaways.delete(giveawayMessage.id);
        }, duration * 1000);
    }
};