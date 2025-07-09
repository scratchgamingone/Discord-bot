
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  staffOnly: true,
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member (Staff only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes (1-40320)')
        .setMinValue(1)
        .setMaxValue(40320)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the timeout')
        .setRequired(false)),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_TEAM;
    
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'You need to be a staff member to use this command!', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    const member = await interaction.guild.members.fetch(targetUser.id);
    
    if (!member) {
      return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({ content: 'You cannot timeout yourself!', ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'You cannot timeout someone with equal or higher roles!', ephemeral: true });
    }

    try {
      await member.timeout(duration * 60 * 1000, reason);
      await interaction.reply({ content: `Successfully timed out ${targetUser.tag} for ${duration} minutes. Reason: ${reason}` });
    } catch (error) {
      console.error('Error timing out member:', error);
      await interaction.reply({ content: 'Failed to timeout the member. Please check my permissions.', ephemeral: true });
    }
  },
};
