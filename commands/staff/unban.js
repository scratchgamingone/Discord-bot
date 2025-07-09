
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  staffOnly: true,
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server (Staff only)')
    .addStringOption(option =>
      option.setName('user_id')
        .setDescription('The user ID to unban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the unban')
        .setRequired(false)),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_TEAM;
    
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'You need to be a staff member to use this command!', ephemeral: true });
    }

    const userId = interaction.options.getString('user_id');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    try {
      const bannedUser = await interaction.guild.bans.fetch(userId);
      
      if (!bannedUser) {
        return interaction.reply({ content: 'This user is not banned from the server.', ephemeral: true });
      }

      await interaction.guild.members.unban(userId, reason);
      await interaction.reply({ content: `Successfully unbanned user with ID ${userId}. Reason: ${reason}` });
    } catch (error) {
      console.error('Error unbanning user:', error);
      await interaction.reply({ content: 'Failed to unban the user. They may not be banned or the ID is invalid.', ephemeral: true });
    }
  },
};
