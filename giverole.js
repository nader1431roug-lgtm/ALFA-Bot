const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'giverole',
  owners: true,
  async execute(message, args, client) {
    const roleName = args.join(' ');
    if (!roleName) {
      return message.reply('Please specify the role name or ID.');
    }

    const role = message.guild.roles.cache.find(
      (r) => r.name === roleName || r.id === roleName
    );

    if (!role) {
      return message.reply('Role not found. Please check the role name or ID.');
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply("I don't have permission to manage roles.");
    }

    const members = await message.guild.members.fetch();
    const membersToAssign = members.filter(
      (member) => !member.roles.cache.has(role.id) && !member.user.bot
    );

    if (!membersToAssign.size) {
      return message.reply('No members to assign the role to.');
    }

    const progressMessage = await message.reply(`Starting to assign the role **${role.name}** to ${membersToAssign.size} members...`);

    let processedCount = 0;

    for (const member of membersToAssign.values()) {
      try {
        await member.roles.add(role);
        processedCount++;

        progressMessage.edit(
          `Assigning role **${role.name}**:\n**Progress:** ${processedCount}/${membersToAssign.size} members completed.`
        ).catch(console.error);

      } catch (err) {
        console.error(`Failed to assign role to ${member.user.tag}:`, err);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await progressMessage.edit(`✅ Successfully assigned the role **${role.name}** to all eligible members!`);
  },
};