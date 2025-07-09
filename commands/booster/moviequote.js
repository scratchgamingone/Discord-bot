
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  boosterOnly: true,
  data: new SlashCommandBuilder()
    .setName('moviequote')
    .setDescription('Get a random movie quote (Booster only)'),

  async execute(interaction) {
    await interaction.deferReply();

    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await fetch('https://api.quotable.io/random?tags=movie', {
          timeout: 10000 // 10 second timeout
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
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
        return; // Success, exit the function
        
      } catch (error) {
        attempts++;
        console.error(`Error fetching movie quote (attempt ${attempts}):`, error);
        
        if (attempts >= maxRetries) {
          await interaction.editReply('Sorry, I couldn\'t fetch a movie quote after multiple attempts. This might be due to network issues. Please try again later.');
          return;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
  },
};
