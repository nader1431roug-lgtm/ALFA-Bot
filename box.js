const { ContainerBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SeparatorBuilder, SectionBuilder, TextDisplayBuilder } = require('discord.js');
const { PREFIX, BOX_CHANNEL_ID, MAIN_SERVER_ID, EMBED_COLOR, SERVER_LINE } = require('../../config.js');
const boxSystem = require('../../src/managers/boxSystem');
module.exports = {
    name: 'box',
    owners: true, // لو عايز بس الأونرز يستخدموه
    async execute(message, args, client) {
        const guild = client.guilds.cache.get(MAIN_SERVER_ID);
        if (!guild) return;

        const channel = guild.channels.cache.get(BOX_CHANNEL_ID);
        if (!channel) return;

        if (!message.content.includes(" "))  {
            return message.reply(`\`${PREFIX}box <كمية الكوينز>\``);
        }

        const reward = Number(args[0]);
        if (isNaN(reward) || reward < 1) return message.reply('يرجى وضع عدد صالح من الكوينز!');
        const crow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`box_cmd_${reward}`)
                .setLabel("Claim")
                
                .setStyle(ButtonStyle.Secondary)
        );
     
const bText = new TextDisplayBuilder().setContent(`** Lucky Box!**
                                 
- **أول شـخـص يـضـغـط يـحـصـل عـلـى \`${reward}\` كـويـنـز!**


-# **||@everyone||**`);
        
        const bcontainer = new ContainerBuilder()
       
.addSeparatorComponents(
    new SeparatorBuilder()
    )
            .addTextDisplayComponents(
       bText,
            )

     .addActionRowComponents(
         crow,
         )
       .addSeparatorComponents(
    new SeparatorBuilder()
    );

        await channel.send({ 
 flags: MessageFlags.IsComponentsV2,
                            components: [bcontainer] });
       
        await channel.send(`${SERVER_LINE}`);
        
        
    }
};