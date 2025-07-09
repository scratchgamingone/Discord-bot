import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("flipcoin")
    .setDescription("Flip a coin and get Heads or Tails"),

  async execute(interaction) {
    await interaction.deferReply();

    // Simulate flipping a coin
    const result = Math.random() < 0.5 ? "Heads" : "Tails";

    const embed = new EmbedBuilder()
      .setTitle("🪙 Coin Flip Result")
      .setDescription(`The coin landed on: **${result}**`)
      .setColor("#FFD700")
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
