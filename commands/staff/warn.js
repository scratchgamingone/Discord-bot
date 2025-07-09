
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  staffOnly: true,
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member (Staff only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the warning')
        .setRequired(true)),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_TEAM;
    
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'You need to be a staff member to use this command!', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    
    const member = await interaction.guild.members.fetch(targetUser.id);
    
    if (!member) {
      return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({ content: 'You cannot warn yourself!', ephemeral: true });
    }

    const warnEmbed = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle('⚠️ Warning Issued')
      .setDescription(`**User:** ${targetUser.tag}\n**Reason:** ${reason}\n**Warned by:** ${interaction.user.tag}`)
      .setTimestamp();

    try {
      // Try to send DM to the user
      await targetUser.send({
        embeds: [new EmbedBuilder()
          .setColor('#ff9900')
          .setTitle('⚠️ You have been warned')
          .setDescription(`**Server:** ${interaction.guild.name}\n**Reason:** ${reason}\n**Warned by:** ${interaction.user.tag}`)
          .setTimestamp()]
      }).catch(() => {
        // If DM fails, continue anyway
      });

      await interaction.reply({ embeds: [warnEmbed] });
    } catch (error) {
      console.error('Error warning member:', error);
      await interaction.reply({ content: 'Failed to warn the member.', ephemeral: true });
    }
  },
};
