
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  boosterOnly: true,
  data: new SlashCommandBuilder()
    .setName('fortunecookie')
    .setDescription('Get your fortune from a virtual fortune cookie (Booster only)'),

  async execute(interaction) {
    const fortunes = [
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "Your future is created by what you do today, not tomorrow.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The only impossible journey is the one you never begin.",
      "In the middle of difficulty lies opportunity.",
      "Believe you can and you're halfway there.",
      "The way to get started is to quit talking and begin doing.",
      "Don't be afraid to give up the good to go for the great.",
      "Innovation distinguishes between a leader and a follower.",
      "Life is what happens to you while you're busy making other plans.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "It is during our darkest moments that we must focus to see the light.",
      "You miss 100% of the shots you don't take.",
      "Whether you think you can or you think you can't, you're right.",
      "The only way to do great work is to love what you do.",
      "Good things happen to those who wait, but better things happen to those who act.",
      "Your limitation—it's only your imagination.",
      "Great things never come from comfort zones.",
      "Dream it. Wish it. Do it.",
      "A year from now you may wish you had started today."
    ];

    const luckyNumbers = Array.from({length: 6}, () => Math.floor(Math.random() * 49) + 1);
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('🥠 Fortune Cookie')
      .setDescription(`**Your Fortune:**\n*"${randomFortune}"*`)
      .addFields(
        { name: '🍀 Lucky Numbers', value: luckyNumbers.join(', '), inline: true },
        { name: '🎯 Lucky Color', value: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'][Math.floor(Math.random() * 6)], inline: true }
      )
      .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/325/fortune-cookie_1f960.png')
      .setFooter({ text: 'May fortune smile upon you!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
