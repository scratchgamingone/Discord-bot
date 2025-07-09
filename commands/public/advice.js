
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  data: new SlashCommandBuilder()
    .setName('advice')
    .setDescription('Get a random piece of advice'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      const data = await response.json();

      if (!response.ok || !data.slip || !data.slip.advice) {
        throw new Error('Failed to fetch advice');
      }

      const embed = new EmbedBuilder()
        .setTitle('💡 Random Advice')
        .setDescription(`"${data.slip.advice}"`)
        .setColor('#4CAF50')
        .setFooter({ 
          text: `Advice #${data.slip.id}`,
          iconURL: 'https://cdn.discordapp.com/emojis/lightbulb.png'
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching advice:', error);
      
      // Fallback advice if API fails
      const fallbackAdvice = [
        "Be yourself; everyone else is already taken.",
        "The best time to plant a tree was 20 years ago. The second best time is now.",
        "Don't let yesterday take up too much of today.",
        "It's not what happens to you, but how you react to it that matters.",
        "The only impossible journey is the one you never begin."
      ];
      
      const randomAdvice = fallbackAdvice[Math.floor(Math.random() * fallbackAdvice.length)];
      
      const fallbackEmbed = new EmbedBuilder()
        .setTitle('💡 Random Advice')
        .setDescription(`"${randomAdvice}"`)
        .setColor('#4CAF50')
        .setFooter({ text: 'Fallback advice' })
        .setTimestamp();

      await interaction.editReply({ embeds: [fallbackEmbed] });
    }
  }
};
