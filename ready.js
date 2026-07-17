const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
 async execute(client) {
      
const activity = ({
    name: '~ ALFA MEMBERS ~',
    type: ActivityType.Streaming,
    url: 'https://www.twitch.tv/af-m'
    });
client .user.setStatus('dnd');
     
client.user.setActivity(activity);
    console.log(`${client.user.username} Was Ready ✅`)
  },
};