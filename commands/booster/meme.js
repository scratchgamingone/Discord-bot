
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  boosterOnly: true,
  data: new SlashCommandBuilder()
    .setName('randommeme')
    .setDescription('Get a random meme from Reddit (Booster only)'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await fetch('https://www.reddit.com/r/memes/random/.json');
      const data = await response.json();
      const post = data[0].data.children[0].data;

      if (!post || !post.url) {
        return interaction.editReply('Sorry, I couldn\'t fetch a meme at the moment. Please try again later.');
      }

      const embed = new EmbedBuilder()
        .setColor('#FF4500')
        .setTitle(post.title)
        .setImage(post.url)
        .setFooter({ text: `👍 ${post.ups} | r/memes` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching random meme:', error);
      await interaction.editReply('An error occurred while fetching the meme. Please try again later.');
    }
  },
};
