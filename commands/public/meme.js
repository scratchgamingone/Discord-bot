
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme from Reddit'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error('Failed to fetch meme');
      }

      const embed = new EmbedBuilder()
        .setTitle(data.title || 'Random Meme')
        .setImage(data.url)
        .setColor('#FF6B35')
        .setFooter({ 
          text: `👍 ${data.ups || 0} upvotes | r/${data.subreddit || 'memes'}`,
          iconURL: 'https://cdn.discordapp.com/emojis/123456789.png'
        })
        .setTimestamp();

      if (data.postLink) {
        embed.setURL(data.postLink);
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching meme:', error);
      await interaction.editReply({
        content: '❌ Sorry, I couldn\'t fetch a meme right now. Please try again later!',
        ephemeral: true
      });
    }
  }
};
