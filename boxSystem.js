const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  SeparatorBuilder,
  MessageFlags
} = require('discord.js');
const {
  PREFIX,
  BALANCE_PRICE,
  TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  MAIN_SERVER_ID,
  EMBED_COLOR,
  SERVER_LINE,
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
  BOX_CHANNEL_ID,
  AUTH_URL,
  BOT_URL,
  PROBOT_IDS, 
  OWNERS,
} = require('../../config.js');

let running = false;
let timeout = null;

const MIN_TIME = 30_000;
const MAX_TIME = 60_000;

const MIN_REWARD = 5;
const MAX_REWARD = 35;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendBox(client) {
  const guild = client.guilds.cache.get(MAIN_SERVER_ID);
  if (!guild) return;

  const channel = guild.channels.cache.get(BOX_CHANNEL_ID);
  if (!channel) return;

  const reward = rand(MIN_REWARD, MAX_REWARD);
    
    const bText = new TextDisplayBuilder().setContent(`# ** Lucky Box!**
                                 
- **أول شـخـص يـضـغـط يـحـصـل عـلـى \`${reward}\` كـويـنـز!**


-# **||@everyone||**`);

    
    
    
    const bxrow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`box_collect_${reward}`)
      .setLabel('Claim')
      .setStyle(ButtonStyle.Secondary)
  );
const bxcontainer = new ContainerBuilder()
       
.addSeparatorComponents(
    new SeparatorBuilder()
    )
            .addTextDisplayComponents(
       bText,
            )

     .addActionRowComponents(
         bxrow,
         )
       .addSeparatorComponents(
    new SeparatorBuilder()
    );
    
  
  await channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [bxcontainer] });
  
  await channel.send(`${SERVER_LINE}`)
}

function loop(client) {
  if (!running) return;

  const delay = rand(MIN_TIME, MAX_TIME);
  timeout = setTimeout(async () => {
    await sendBox(client);
    loop(client);
  }, delay);
}

module.exports = {
  start(client) {
    if (running) return false;
    running = true;
    loop(client);
    return true;
  },

  stop() {
    if (!running) return false;
    clearTimeout(timeout);
    timeout = null;
    running = false;
    return true;
  },

  drop(client) {
    return sendBox(client); // يدوي
  }
};