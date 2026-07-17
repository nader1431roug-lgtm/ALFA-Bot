const { 
  Client,
  EmbedBuilder,
  WebhookClient,
  ButtonBuilder,
  ActionRowBuilder,
  Collection,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
  ButtonStyle,
  GatewayIntentBits
} = require("discord.js");

const { readdirSync } = require('fs');const {
  PREFIX,
  BALANCE_PRICE,
  TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  MAIN_SERVER_ID,
  ATHBET_NAFSEK_LOG,
  MONGOOSE,
  BALANCE_LOG,
  EMBED_COLOR,
  SERVER_LINE,
  fa7sbot,
  fa7s_url,
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
  TICKET_CATEGORY_BUY,
  TAX_CHANNEL,
  logs,
  AUTH_URL,
  BOT_URL,
  FEEDBACK_CHANNEL_ID,
  PROBOT_IDS, 
  OWNERS,
  BOX_CHANNEL_ID,
  BOX_COOLDOWN,
  PORT
} = require('./config.js');
const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.MessageContent,

 GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers

  ]

});
const events = readdirSync('events');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const DBManager = require('./src/managers/DBManager');
const usersData = require('./src/models/Users.js');
const axios = require('axios');
const fs = require('fs');

client.commands = new Collection();
client.prefix = PREFIX;
client.db = {
  users: new DBManager(usersData) 
};
process.on('uncaughtException', (err) => {
  console.error('هـنـاك خـطـأ غـيـر مـعـالج:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('تـم رفـض وعـد غـيـر مـعـالج:', reason);
});

process.on('unhandledRejection', (err) => console.error(err));
           
mongoose.connection.on('connected', () => console.log('Connected to database !'));
mongoose.connect(MONGOOSE);

app.get('/login', async (req, res) => {
  let response;
  let access_token;
  let refresh_token;
  const { code } = req.query;

  if (code) {
    try {
      response = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        scope: 'identify'
      }).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      access_token = response.data.access_token;
      refresh_token = response.data.refresh_token;

      response = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `${response.data.token_type} ${access_token}`
        }
      });
    } catch (err) {
      return res.send(err.response?.data?.error_description || 'Unknown Error');
    }

    const userData = await usersData.findOne({
      id: response.data.id
    }) || new usersData({
      id: response.data.id,
    });

    userData.accessToken = access_token;
    userData.refreshToken = refresh_token;

    await userData.save();
    
    const count = await usersData.countDocuments({ accessToken: { $exists: true } });
    const guild = client.guilds.cache.get(MAIN_SERVER_ID);
   const channel = guild.channels.cache.get(ATHBET_NAFSEK_LOG);
if (channel) {
  let usersCount = await usersData.countDocuments({ accessToken: { $exists: true } });


channel.send({
  content: 'تـم تـوثـيـق عـضـو جـديـد! 🎉',
  embeds: [{
    title: `مـرحـبـاً بـ ${response.data.username}!`,
    description: `تـم تـوثـيـق الـعـضـو الـجـديـد بـنـجـاح.` +

                 `\n\n**عـدد الأعـضـاء الـمـوثـقـيـن حـالـيـاً: ${usersCount}**`,
    thumbnail: { 
      url: `https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}.png`
    },
    color: '11993088'
  }]
});
}


    res.redirect('/success');
  } else {
    res.redirect(AUTH_URL);
  }
});


app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Roboto', sans-serif;
                    background: linear-gradient(135deg, #7289DA, #3BAF55);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                h1 {
                    font-size: 3em;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }

                p {
                    font-size: 1.2em;
                    margin-bottom: 40px;
                }

                .btn {
                    padding: 15px 30px;
                    background-color: #43B581;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s, transform 0.2s;
                    font-weight: 500;
                    font-size: 18px;
                    margin: 5px;
                }

                .btn:hover {
                    background-color: #3BAF55;
                    transform: scale(1.05);
                }

                footer {
                    position: absolute;
                    bottom: 20px;
                    font-size: 14px;
                    color: #AAB8C2;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to Our Service!</h1>
            <p>Your gateway to amazing features.</p>
            <a href="/login" class="btn">Login</a>
            <a href="/features" class="btn">Explore Features</a>
            <footer>
                &copy; 2024 All Rights Reserved
            </footer>
        </body>
        </html>
    `);
});
app.get('/success', (req, res) => {
    const avatarUrl = req.query.avatar || '';
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Success</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }

                body {
                    font-family: 'Roboto', sans-serif;
                    background: linear-gradient(135deg, #ff4b4b, #d93025);
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    text-align: center;
                    overflow: hidden;
                    animation: bgFade 5s ease infinite alternate;
                }

                @keyframes bgFade {
                    0% { background: linear-gradient(135deg, #ff4b4b, #d93025); }
                    100% { background: linear-gradient(135deg, #ff7f7f, #d9453d); }
                }

                .loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .loading div {
                    width: 20px;
                    height: 20px;
                    margin: 5px;
                    border-radius: 50%;
                    background: white;
                    animation: loading 0.6s infinite alternate;
                }

                .loading div:nth-child(2) { animation-delay: 0.2s; }
                .loading div:nth-child(3) { animation-delay: 0.4s; }

                @keyframes loading {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.5); }
                }

                .container {
                    background-color: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                    width: 90%;
                    max-width: 500px;
                    transform: translateY(-50px);
                    animation: slideIn 0.8s ease forwards;
                    opacity: 0;
                    display: none;
                }

                @keyframes slideIn {
                    0% { transform: translateY(-50px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                h1 {
                    margin-bottom: 20px;
                    font-weight: 500;
                    font-size: 2.5em;
                    color: #ffdcdc;
                    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
                    animation: popIn 1s ease forwards;
                }

                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                p {
                    margin-bottom: 20px;
                    font-size: 18px;
                    line-height: 1.6;
                    color: #ffe6e6;
                    animation: fadeInText 1.2s ease forwards;
                }

                @keyframes fadeInText {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }

                .btn-home, .btn-other {
                    display: inline-block;
                    padding: 15px 30px;
                    background-color: #ff6b6b;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 18px;
                    margin: 5px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                    transition: all 0.3s ease;
                    animation: fadeInBtn 1.5s ease forwards;
                }

                .btn-home:hover, .btn-other:hover {
                    background-color: #e04848;
                    transform: scale(1.05);
                    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.5);
                }

                .icon {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    margin-bottom: 20px;
                    border: 4px solid #ffdddd;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
                    animation: avatarSpin 3s linear infinite;
                }

                @keyframes avatarSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #ffcccc;
                    animation: fadeInFooter 2s ease forwards;
                }

                @keyframes fadeInFooter {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
            </style>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        document.querySelector('.loading').style.display = 'none';
                        const container = document.querySelector('.container');
                        container.style.display = 'block';
                        container.style.opacity = '1';
                    }, 2000);
                };
            </script>
        </head>
        <body>
            <div class="loading">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="container" style="opacity: 0;">
                <img src="${avatarUrl}" alt="User Avatar" class="icon">
                <h1>Welcome, Successful Login!</h1>
                <p>You've successfully logged in with your Discord account. Enjoy your time exploring!</p>
                <a href="/" class="btn-home">Return to Home</a>
                <a href="/features" class="btn-other">Explore Features</a>
            </div>
            <footer>&copy; 2024 All Rights Reserved</footer>
        </body>
        </html>
    `);
});


app.get('/features', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Coming Soon</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #7289DA, #4B2C91);
                    color: white;
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                    overflow: hidden;
                }

                h1 {
                    font-size: 4em;
                    animation: fadeIn 1s ease-in-out;
                }

                p {
                    font-size: 1.5em;
                    margin: 20px 0;
                    animation: fadeIn 1.5s ease-in-out;
                }

                footer {
                    position: absolute;
                    bottom: 20px;
                    font-size: 14px;
                    color: #AAB8C2;
                    animation: fadeIn 2s ease-in-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .loading {
                    position: absolute;
                    bottom: 50px;
                    font-size: 1em;
                    color: #AAB8C2;
                    animation: fadeIn 2.5s ease-in-out;
                }
            </style>
        </head>
        <body>
            <h1>Coming Soon</h1>
            <footer>
                &copy; 2024 All Rights Reserved
            </footer>
        </body>
        </html>
    `);
});


events.filter(e => e.endsWith('.js')).forEach(event => {
  event = require(`./events/${event}`);
  event.once ? client.once(event.name, (...args) => event.execute(...args, client)) : client.on(event.name, (...args) => event.execute(...args, client));
});

events.filter(e => !e.endsWith('js')).forEach(folder => {
  readdirSync('events/' + folder).forEach(event => {
    event = require(`./events/${folder}/${event}`);
    event.once ? client.once(event.name, (...args) => event.execute(...args, client)) : client.on(event.name, (...args) => event.execute(...args, client));
  });
});

for (let folder of readdirSync('commands').filter(folder => !folder.includes('.'))) {
  for (let file of readdirSync('commands/' + folder).filter(f => f.endsWith('.js'))) {    
    const command = require(`./commands/${folder}/${file}`);
    command.category = folder;
    client.commands.set(command.name?.trim().toLowerCase(), command);
  }
}
client.on("messageCreate", async message => {
	if (message.content === PREFIX + "refresh" && OWNERS.includes(message.author.id)) {
		let mm = await message.channel.send({
			content: `**يـتـم الان عـمـل ريفـرش , بـرجـاء انـتـظـار ...**`
		}).catch(() => { });
		let users = await usersData.find({ accessToken: { $exists: true } });
		let count = 0;
		let removedDueToGuilds = 0;
		let removedDueToTokenError = 0;
		let removedDueToVerification = 0;
		let removedDueToOtherErrors = 0;
		let totalChecked = 0;
		let stockBefore = users.length;
		for (let userData of users) {
			totalChecked++;
			try {
				let res = await axios.post('https://discord.com/api/oauth2/token',
					{
						client_id: CLIENT_ID,
						client_secret: CLIENT_SECRET,
						grant_type: 'refresh_token',
						refresh_token: userData.refreshToken,
					}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				});

				userData.accessToken = res.data.access_token;
				userData.refreshToken = res.data.refresh_token;

				await userData.save();
				try {
					let userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
						headers: {
							Authorization: `Bearer ${res.data.access_token}`
						}
					});
					let userDataa = userResponse.data;
					let hasNitro = userDataa.premium_type === 1 || userDataa.premium_type === 2;
					let guildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
						headers: {
							Authorization: `Bearer ${res.data.access_token}`
						}
					});
					let guildCount = guildsResponse.data.length;
					if ((guildCount >= 100 && !hasNitro) || (guildCount >= 200)) {
						let datadata = await usersData.findById(userData._id);
						datadata.accessToken = undefined
						datadata.refreshToken = undefined
						await datadata.save()
						removedDueToGuilds++;
					}
				} catch (error) {
					if (error.response && error.response.status === 401) {
						let datadata = await usersData.findById(userData._id);
						datadata.accessToken = undefined
						datadata.refreshToken = undefined
						await datadata.save()
						removedDueToTokenError++;
					}
					else if (error.response && error.response.status === 403) {
						let datadata = await usersData.findById(userData._id);
						datadata.accessToken = undefined
						datadata.refreshToken = undefined
						await datadata.save()
						removedDueToVerification++;
					}
					else {
						let datadata = await usersData.findById(userData._id);
						datadata.accessToken = undefined
						datadata.refreshToken = undefined
						await datadata.save()
						removedDueToOtherErrors++;
					}
				}

			} catch (error) {
				let datadata = await usersData.findById(userData._id);
				datadata.accessToken = undefined
				datadata.refreshToken = undefined
				await datadata.save()
				removedDueToTokenError++;
			}
		}
		let usersAfter = await usersData.find({ accessToken: { $exists: true } });
		let stockAfter = usersAfter.length;
		let embed = new EmbedBuilder()
			.setTitle(` **نـتـائـج تـحـديـث الـتـوكـنـات**`)
			.setColor(`${EMBED_COLOR}`)
			.addFields({
				name:` تـمـت الإزالـة بـسـبـب تـجـاوز 100 خـادم:`,
				value: `\`${removedDueToGuilds}\``,
				inline: true
			}, {
				name:` تـمـت الإزالـة بـسـبـب فـشـل الـوصـول إلـى الـتـوكـن:`,
				value: `\`${removedDueToTokenError}\``,
				inline: true
			}, {
				name:` تـمـت الإزالـة بـسـبـب الـحـاجـة إلـى تـحـقـق:`,
				value: `\`${removedDueToVerification}\``,
				inline: true
			}, {
				name:` تـمـت الإزالـة بـسـبـب أخـطـاء أخـرى:`,
				value: `\`${removedDueToOtherErrors}\``,
				inline: true
			}, {
				name:` سـتـوك الـقـديـم:`,
				value: `\`${stockBefore}\``,
				inline: true
			}, {
				name:`سـتـوك الـحـالي:`,
				value: `\`${stockAfter}\``,
				inline: true
			}, {
				name:` تـمـت الإزالـة بـشـكـل إجـمـالي:`,
				value: `\`${removedDueToGuilds + removedDueToTokenError + removedDueToVerification + removedDueToOtherErrors}\``,
				inline: true
			})
			.setFooter({
				text:` عـمـلـيـة الـتـحـديـث اكـتـمـلـت بـنـجـاح.`
			})
			.setTimestamp();
let rfText = `**عملنا ريفريش وطار \`${removedDueToGuilds + removedDueToTokenError + removedDueToVerification + removedDueToOtherErrors}\` من الستوك 🥺

 يعني النسبة الحين صارت 100 

 وش مستني خش اشتري قبل ما يدخلون 100 سيرفر 💢

 <#1464482036956790855> 

 <#1464482031714177089> 
**
-# **||\@everyone||**` 
		mm.edit({
			content: null,
			embeds: [embed]
		}).catch(() => {
			message.channel.send({
				embeds: [embed]
			}).catch();
		});
   message.channel.send({
       content: rfText
       })
   message.channel.send(`${SERVER_LINE}`)
	}
})
/*
setInterval(async () => {
  const users = await usersData.find({ accessToken: { $exists: true } });
  
  for (const userData of users) {
    try {
      const response = await axios.post('https://discord.com/api/oauth2/token',
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: userData.refreshToken,
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
       });
      
       userData.accessToken = response.data.access_token;
       userData.refreshToken = response.data.refresh_token;

       await userData.save();
      
       console.log(`✅ ${userData.id}`);
     } catch {
       await usersData.findById(userData._id);
       
       console.log(`❌ ${userData.id}`);
     }
   }
 }, 36e5);
*/
client.on("messageCreate", async (message) => {
    
  if (message.author.bot) return;
    
  if (message.content === "-" && OWNERS.includes(message.author.id)) {
    await message.delete();
      await message.channel.send(`${SERVER_LINE}`);
    }
 });



 client.on('messageCreate', async (message) => {
  const targetChannelId = FEEDBACK_CHANNEL_ID;

  if (message.channel.id === targetChannelId && !message.author.bot) {
    try {
      await message.react(``);
      
      await message.channel.send(`${SERVER_LINE}`);
    } catch (error) {
      console.error('خـطـأ فـي إضـافـة الإيـمـوجـي أو إرسـال الـرسـالـة:', error);
    }
  }
});

 client.on("messageCreate", async (message) => {
     
     
  let taxchannel = TAX_CHANNEL;

  let args = message.content.split(" ").slice(0).join(" ");
  if (message.author.bot) return;
  if (args.endsWith("m")) args = args.replace(/m/gi, "") * 1000000;
  else if (args.endsWith("k")) args = args.replace(/k/gi, "") * 1000;
  else if (args.endsWith("M")) args = args.replace(/M/gi, "") * 1000000;
  else if (args.endsWith("K")) args = args.replace(/K/gi, "") * 1000;
  else if (args.endsWith("b")) args = args.replace(/b/gi, "") * 1000000000;
  else if (args.endsWith("B")) args = args.replace(/B/gi, "") * 1000000000;

  if (message.channel.id !== taxchannel) return;

  let args2 = parseInt(args);
  let tax = Math.floor((args2 * 20) / 19 + 1);
  let tax2 = Math.floor((args2 * 20) / 19 + 1 - args2);
  let tax3 = Math.floor((tax2 * 20) / 19 + 1);
  let tax4 = Math.floor(tax2 + tax3 + args2);

  if (!args2) return message.delete();
  if (isNaN(args2)) return message.delete();
  if (args2 < 1) return message.delete();

  message.reply(`**\` ${tax} \`**`);
});


client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('set')) return;

  const args = message.content.slice(`${PREFIX}set`.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'name') {
    const newName = args.join(' ');
    try {
      await client.user.setUsername(newName);
      message.reply(`تـم تـغـيـير اسـم الـبـوت إلـى ${newName}`);
    } catch (error) {
      console.error('Error changing bot name:', error);
      message.reply('حـدث خـطـأ أثـنـاء تـغـيـير اسـم الـبـوت.');
    }
  } else if (command === 'avatar') {
    const newAvatarURL = args[0];
    try {
      await client.user.setAvatar(newAvatarURL);
      message.reply('تـم تـغـيـير صـورة الـبـوت بـنـجـاح.');
    } catch (error) {
      console.error('Error changing bot avatar:', error);
      message.reply('حـدث خـطـأ أثـنـاء تـغـيـير صـورة الـبـوت.');
    }
  }
});

function extractServerIdFromInvite(inviteLink) {
  const regex = /discord\.gg\/(.+)/;
  const match = inviteLink.match(regex);
  return match ? match[1] : null;
}

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'server-id') {
    const modal = new ModalBuilder()
      .setCustomId('invite-modal')
      .setTitle('اضـافـة بـوت');

    const inviteLinkInput = new TextInputBuilder()
      .setCustomId('invite-link-input')
      .setMinLength(1)
      .setPlaceholder('أدخـل رابـط الـدعـوة هـنـا')
      .setStyle(TextInputStyle.Short)
      .setLabel('رابـط الـدعـوة');

    const row1 = new ActionRowBuilder().addComponents(inviteLinkInput);
    modal.addComponents(row1);
    await interaction.showModal(modal);

  } else if (interaction.isModalSubmit() && interaction.customId === 'invite-modal') {
    const inviteLink = interaction.fields.getTextInputValue('invite-link-input');

    try {
      const invite = await client.fetchInvite(inviteLink); 
      const guild = await invite.guild; 

      await interaction.reply({
        content: `${guild.id}`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Error fetching server ID:', error);
      await interaction.reply({
        content: 'حـدث خـطـأ! تـأكـد مـن أن رابـط الـدعـوة صـالـح وأن الـبـوت يـمـلـك صـلاحـيـة الانـضـمـام لـلسـيـرفـرات.',
        ephemeral: true
      });
    }
  }
});


const dataFile = './tickets.json';
function loadData() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tickets data:', error);
    return {};
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving tickets data:', error);
  }
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const guild = interaction.guild;
  const member = interaction.member;

  const isSaleOpen = true;

  if (interaction.customId === 'ticket') {
    if (!isSaleOpen) {
      await interaction.reply({
        content: ' **عـذراً، الـبـيـع مـغـلـق حـالـيـاً. يـرجـى انـتـظـار فـتـحـه لاحـقـاً.**',
        ephemeral: true,
      });
      return;
    }

    const tickets = loadData();

    if (tickets[member.id]) {
      const ticketChannelId = tickets[member.id];
      await interaction.reply({
        content: ` **لـديـك تـذكـرة مـفـتـوحـة بـالـفـعـل. يـمـكـنـك الـعـثـور عـلـيـهـا هـنـا: <#${ticketChannelId}>.**`,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('delete-old')
              .setLabel('حـذف الـتـذكـرة الـقـديـمـة')
              
              .setStyle(ButtonStyle.Primary)
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: ' **جـاري إنـشـاء تـذكـرتـك... يـرجـى الانـتـظـار.**',
      ephemeral: true,
    });

    try {
      const ticketChannel = await guild.channels.create({
        name: `buy-${member.user.username}`,
        type: 0,
        topic: `تـذكـرة الـدعـم الـخـاصـة بـ ${member.user.tag}`,
        parent: TICKET_CATEGORY_BUY,
        permissionOverwrites: [
          { id: member.id, allow: ['ViewChannel', 'SendMessages'] },
          { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
        ],
      });

      tickets[member.id] = ticketChannel.id;
      saveData(tickets);

      const ticketEmbed = new EmbedBuilder()
        .setTitle(`**تـذكـرتـك الـخـاصـة جـاهـزة!**`)
        .setImage("https://i.postimg.cc/13KFc488/Untitled62-20260124080833.png")
       .setDescription(`** مـرحـبـاً بـك فـي نـظـام الـتـذاكـر الـخـاص بـنـا!**
 **تـفـاصـيـل الـخـدمـة:**
        -  يـمـكـنـك شـراء الأعـضـاء الـمـتـاحـيـن فـي الـمـخـزون الـحـالي بـجـودة عـالـيـة وسـرعـة تـنـفـيـذ.
        - يـتـم الـتـعـامـل بـاسـتـخـدام عـمـلـة الـكـريـديـت فـقـط لـضـمـان سـهـولـة الـدفـع، وفـي حـال رغـبـتـك بـاسـتـخـدام طـريـقـة دفـع أخـرى، يُـرجـى الـتـواصـل مـع فـريـق الإدارة.
        -  الـخـدمـة مـصـمـمـة لـتـلـبـيـة احـتـيـاجـاتـك بـأقـصـى سـرعـة مـمـكـنـة، لـكـن نـود أن نـنـوه أنـه بـسـبـب سـيـاسـات Discord قـد لا يـتـم دخـول الـعـدد الـمـطـلـوب بـالـكـامـل.

 **مـزايـا الـخـدمـة:**
        -  دعـم فـنـي مـتـواصـل عـلـى مـدار الـسـاعـة لـمـسـاعـدتـك فـي أي اسـتـفـسـار.
        -  ضـمـان الـخـصـوصـيـة والأمـان فـي جـمـيـع الـتـعـامـلات.
        -  تـحـديـثـات مـسـتـمـرة لـضـمـان تـحـسـيـن الـخـدمـة وتـلـبـيـة تـوقـعـاتـك.

 **إرشـادات الاسـتـخـدام:**
        1. اخـتـر الـخـدمـة الـتـي تـرغـب فـيـهـا مـن خـلال الأسـوة أدنـاه.
        2. تـأكـد مـن إدخـال الـبـيـانـات الـمـطـلـوبـة بـشـكـل صـحـيـح لـضـمـان تـنـفـيـذ طـلـبـك بـدقـة.
        3. فـي حـال وجـود أي اسـتـفـسـار، لا تـتـردد فـي الـتـواصـل مـعـنـا عـبـر الـتـذكـرة.

 **مـلاحـظـات إضـافـيـة:**
        - يـرجـى قـراءة شـروط الـخـدمـة قـبـل تـنـفـيـذ أي طـلـب.
        - نـحـن نـسـعـى دائـمـاً لـتـقـديـم أفـضـل تـجـربـة مـمـكـنـة، ونـرحـب بـمـلاحـظـاتـكـم لـتـطـويـر خـدمـاتـنـا.

        ــــــــــــــــــــــــــــــــــــــــــــــ  
 **لـلـبـدء، اسـتـخـدم الـخـيـارات الـمـتـاحـة أدنـاه!**
        `)
       .setColor(`${EMBED_COLOR}`)
        .setFooter({ text: `تـم إنـشـاء الـتـذكـرة بـواسـطـة ${member.user.tag}`, iconURL: member.displayAvatarURL() })
        .setTimestamp();

      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('buy-balance')
          .setLabel('شـراء رصـيـد')
          
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('show-server-modal')
          .setLabel('فـحـص الـخـادم')
          
          .setStyle(ButtonStyle.Secondary)
      );

      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('withdraw-m-balance')
          .setLabel('شـراء أعـضـاء')
          
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setURL(BOT_URL)
          .setLabel('إضـافـة الـبـوت')
          
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setCustomId('close')
          .setLabel('غـلـق الـتـذكـرة')
          
          .setStyle(ButtonStyle.Secondary)
      );
      await ticketChannel.send({
        content: `<@${member.id}>  **تـم إنـشـاء تـذكـرتـك! يـرجـى اسـتـخـدام الـخـيـارات أدنـاه لإتـمـام طـلـبـك.**`,
        embeds: [ticketEmbed],
        components: [row1, row2],
      });
   await ticketChannel.send(`${SERVER_LINE}`);
      
 const fa7sRow = new ActionRowBuilder().addComponents(
     new ButtonBuilder()
     .setLabel('اضـافـة بـوت الـفـحـص')
     
     .setURL(fa7s_url)
     .setStyle(ButtonStyle.Link)
     );
  await ticketChannel.send({
  content: `**قبل نبدأ، ضيف بوت الفحص من الزر تحت**

**وبعد الانتهاء من العملية، نتمنى تقييمك هنا**

<#${FEEDBACK_CHANNEL_ID}>

**المعرفة رصيدك الحالي اكتب**

\`${PREFIX}coins\`

**يرجى عدم طرد أي بوت أثناء عملية الإدخال، لأن طردهم يؤدي إلى إيقاف العملية فوراً**`,
  components: [fa7sRow],// <--- صح
});
    
 await ticketChannel.send(`${SERVER_LINE}`),

      await interaction.editReply({
        content: ` **تـم إنـشـاء تـذكـرتـك بـنـجـاح! يـمـكـنـك الـدخـول إلـى الـقـنـاة الـتـالـيـة: ${ticketChannel}.**`,
        ephemeral: true,
      });

      const logChannel = guild.channels.cache.find(channel => channel.id === logs);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setDescription(`📩 **${member}** قـام بـفـتـح تـذكـرة جـديـدة: ${ticketChannel}`)
       .setColor(`${EMBED_COLOR}`)
          .setTimestamp();

        await logChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error('Error creating ticket:', error);
      await interaction.editReply({
        content: '❌ **حـدث خـطـأ أثـنـاء إنـشـاء الـتـذكـرة. يـرجـى الـمـحـاولـة لاحـقـاً.**',
        ephemeral: true,
      });
    }
  } else if (interaction.customId === 'delete-old') {
    const tickets = loadData();
    const oldTicketId = tickets[member.id];

    try {
      const oldTicketChannel = guild.channels.cache.get(oldTicketId);
      await oldTicketChannel.delete();
    } catch (error) {
      console.error('Error deleting old ticket:', error);
    }

    delete tickets[member.id];
    saveData(tickets);

    await interaction.reply({
      content: 'تـم حـذفـهـا بـنـجـاح',
      ephemeral: true
    });
  } else if (interaction.customId === 'cancel-new') {
    await interaction.update({
      content: 'تـم إلـغـاء عـمـلـيـة إنـشـاء الـتـذكـرة.',
      components: []
    });
  } else if (interaction.customId === 'close') {
    const confirmButton = new ButtonBuilder()
        .setCustomId('confirm-delete')
        .setLabel('حـذف الـتـذكـرة')
        .setStyle(ButtonStyle.Danger); 
    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel-delete')
        .setLabel('إلـغـاء الـحـذف')
        .setStyle(ButtonStyle.Secondary); 

    const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton); 

    await interaction.reply({
        content: 'هـل أنـت مـتـأكـد مـن حـذف الـتـذكـرة؟',
        components: [row],
        ephemeral: true
    });

    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      await i.deferUpdate();
  
      if (i.customId === 'confirm-delete') {
          const tickets = loadData();
          delete tickets[member.id];
          saveData(tickets);
  
          await i.followUp({ content: 'سـيـتـم حـذف الـتـذكـرة بـعـد 5 ثـوانـي...', ephemeral: true });
  
          setTimeout(async () => {
              await interaction.channel.delete(); 
  
              const logChannel = guild.channels.cache.find(channel => channel.id === logs);
              if (logChannel) {
                  const logEmbed = new EmbedBuilder()
                      .setTitle('تـم إغـلاق الـتـذكـرة')
                      .setDescription(`${member} قـام بـإغـلاق الـتـذكـرة.`)
                      .setTimestamp();
  
                  await logChannel.send({ embeds: [logEmbed] });
              }
          }, 5000);
      } else if (i.customId === 'cancel-delete') {
          await i.update({ content: 'تـم إلـغـاء عـمـلـيـة حـذف الـتـذكـرة.', components: [], ephemeral: true });
      }
  });
}
});





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT.toString()}`);
});


client.login(TOKEN);
require('./src/Util.js');
