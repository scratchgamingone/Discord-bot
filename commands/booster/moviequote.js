
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  boosterOnly: true,
  data: new SlashCommandBuilder()
    .setName('moviequote')
    .setDescription('Get a random movie quote (Booster only)'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await fetch('https://api.quotable.io/random?tags=movie');
      const quote = await response.json();

      if (!quote || !quote.content) {
        return interaction.editReply('Sorry, I couldn\'t fetch a movie quote at the moment. Please try again later.');
      }

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🎬 Random Movie Quote')
        .setDescription(`"${quote.content}"`)
        .addFields({ name: 'Author', value: quote.author, inline: true })
        .setFooter({ text: 'Powered by Quotable API' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching movie quote:', error);
      await interaction.editReply('An error occurred while fetching the movie quote. Please try again later.');
    }
  },
};
