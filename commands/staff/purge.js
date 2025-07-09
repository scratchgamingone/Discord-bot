
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  staffOnly: true,
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete multiple messages from a channel (Staff only)')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Only delete messages from this user')
        .setRequired(false)),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_TEAM;
    
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'You need to be a staff member to use this command!', ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('user');
    
    await interaction.deferReply({ ephemeral: true });

    try {
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      
      let messagesToDelete = messages;
      if (targetUser) {
        messagesToDelete = messages.filter(msg => msg.author.id === targetUser.id);
      }

      const deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true);
      
      const deletedCount = deletedMessages.size;
      const userText = targetUser ? ` from ${targetUser.tag}` : '';
      
      await interaction.editReply({ content: `Successfully deleted ${deletedCount} message(s)${userText}.` });
    } catch (error) {
      console.error('Error purging messages:', error);
      await interaction.editReply({ content: 'Failed to delete messages. They may be too old (older than 14 days).', ephemeral: true });
    }
  },
};
