
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  staffOnly: true,
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server (Staff only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('delete_days')
        .setDescription('Number of days of messages to delete (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_TEAM;
    
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'You need to be a staff member to use this command!', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const deleteDays = interaction.options.getInteger('delete_days') || 0;
    
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    
    if (member) {
      if (member.id === interaction.user.id) {
        return interaction.reply({ content: 'You cannot ban yourself!', ephemeral: true });
      }

      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ content: 'You cannot ban someone with equal or higher roles!', ephemeral: true });
      }
    }

    try {
      await interaction.guild.members.ban(targetUser, { 
        reason: reason,
        deleteMessageDays: deleteDays 
      });
      await interaction.reply({ content: `Successfully banned ${targetUser.tag} for: ${reason}` });
    } catch (error) {
      console.error('Error banning member:', error);
      await interaction.reply({ content: 'Failed to ban the member. Please check my permissions.', ephemeral: true });
    }
  },
};
