
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  staffOnly: true,
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server (Staff only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')
        .setRequired(false)),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_TEAM;
    
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'You need to be a staff member to use this command!', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    const member = await interaction.guild.members.fetch(targetUser.id);
    
    if (!member) {
      return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({ content: 'You cannot kick yourself!', ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'You cannot kick someone with equal or higher roles!', ephemeral: true });
    }

    try {
      await member.kick(reason);
      await interaction.reply({ content: `Successfully kicked ${targetUser.tag} for: ${reason}` });
    } catch (error) {
      console.error('Error kicking member:', error);
      await interaction.reply({ content: 'Failed to kick the member. Please check my permissions.', ephemeral: true });
    }
  },
};
