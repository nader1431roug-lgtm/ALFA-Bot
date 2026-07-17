const { ContainerBuilder, SeparatorBuilder, StringSelectMenuBuilder, MediaGalleryBuilder, TextDisplayBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SeparatorSpacingSize, EmbedBuilder } = require('discord.js');

const { SERVER_LINE, EMBED_COLOR } = require('../../config.js');

module.exports = {
name: 'spanel',
owners: true, 
async execute (message) {

    message.delete();
    
const bRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setLabel('Buy')
    .setURL('https://discord.com/channels/1454039618436731044/1464482036956790855')
    .setStyle(ButtonStyle.Link),
    
    new ButtonBuilder()
    .setLabel('Terms')
    .setURL('https://discord.com/channels/1454039618436731044/1464481879225798798')
    .setStyle(ButtonStyle.Link),
    );
    
const sRow = new ActionRowBuilder().addComponents( new StringSelectMenuBuilder()
      .setCustomId('support-panel-select')
      .addOptions(
          {
              label: 'Support',
              description: 'To Open A Support Ticket .',
              emoji: {
                  id: '1452575660449988618',
                  name: 'discotoolsxyzicon11'
                  },
              value: 'sup-value'
              },
          {
              label: 'Reset',
              description: 'To Restart The Menu .',
              emoji: {
                  id: '1465429102290010254',
                  name: 'loading'
                  },
              value: 'rst-value'
              }
          )
           );
    
const supContainer = new ContainerBuilder()
.setAccentColor((parseInt(EMBED_COLOR.replace('#', ''), 16)))
.addMediaGalleryComponents(
   new MediaGalleryBuilder().addItems([
       {
        media: {
            url: "https://i.postimg.cc/g0msb9vS/Untitled59-20260123200750.png"
            }
            }
        ])
    )

.addSeparatorComponents(
    new SeparatorBuilder()
       .setSpacing(SeparatorSpacingSize.Large)
    )

.addActionRowComponents(
    sRow,
    )
.addSeparatorComponents(
    new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    )
.addActionRowComponents(
    bRow
    )
.addMediaGalleryComponents(
   new MediaGalleryBuilder().addItems([
    {
        media: {
            url: `${SERVER_LINE}`
            }
        }
    ])
    );
    
 const pMsg = await message.channel.send({
     flags: MessageFlags.IsComponentsV2,
     components: [supContainer]
     });
  
  const embed = new EmbedBuilder()
  .setDescription(`    𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 **𝐀𝐋𝐅𝐀 𝐌𝐞𝐦𝐛𝐞𝐫𝐬** 𝐒𝐮𝐩𝐩𝐨𝐫𝐭! 
𝐇𝐞𝐫𝐞 𝐭𝐨 𝐡𝐞𝐥𝐩 𝐲𝐨𝐮 𝐚𝐧𝐲𝐭𝐢𝐦𝐞! `).setColor(parseInt(EMBED_COLOR.replace('#', ''), 16))
    
 await message.channel.send({
     embeds: [embed]
     });
    
}
};