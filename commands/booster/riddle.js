
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  boosterOnly: true,
  data: new SlashCommandBuilder()
    .setName('riddle')
    .setDescription('Get a challenging riddle to solve (Booster only)'),

  async execute(interaction) {
    const riddles = [
      {
        question: "I have keys but no locks. I have space but no room. You can enter, but you can't go outside. What am I?",
        answer: "A keyboard"
      },
      {
        question: "The more you take, the more you leave behind. What am I?",
        answer: "Footsteps"
      },
      {
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        answer: "An echo"
      },
      {
        question: "What has hands but cannot clap?",
        answer: "A clock"
      },
      {
        question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
        answer: "A candle"
      },
      {
        question: "What gets wet while drying?",
        answer: "A towel"
      },
      {
        question: "I have a head and a tail that will never meet. Having too many of me is always a treat. What am I?",
        answer: "A coin"
      }
    ];

    const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];

    const embed = new EmbedBuilder()
      .setColor('#9932CC')
      .setTitle('🧩 Riddle Challenge')
      .setDescription(randomRiddle.question)
      .setFooter({ text: 'Click the button below to reveal the answer!' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('reveal_answer')
          .setLabel('Reveal Answer')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('💡')
      );

    const response = await interaction.reply({ embeds: [embed], components: [row] });

    const collector = response.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'reveal_answer') {
        const answerEmbed = new EmbedBuilder()
          .setColor('#32CD32')
          .setTitle('🧩 Riddle Answer')
          .setDescription(`**Question:** ${randomRiddle.question}`)
          .addFields({ name: '💡 Answer', value: randomRiddle.answer })
          .setTimestamp();

        await i.update({ embeds: [answerEmbed], components: [] });
      }
    });

    collector.on('end', () => {
      row.components[0].setDisabled(true);
      interaction.editReply({ components: [row] });
    });
  },
};
