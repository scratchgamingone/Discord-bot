import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// Define the list of letters here for easy modification
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Function to generate a random color
const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

// Object to store colors for each letter
const letterColors = {};

// Assign a random color to each letter
letters.forEach(letter => {
    letterColors[letter] = getRandomColor();
});

export default {
    data: new SlashCommandBuilder()
        .setName('randomletter')
        .setDescription('Get a random letter from a predefined list'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            // Select a random letter from the list
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];

            const embed = new EmbedBuilder()
                .setColor(letterColors[randomLetter])
                .setTitle('Random Letter')
                .setDescription(`Your random letter is: **${randomLetter}**`)
                .setTimestamp()
                .setFooter({ text: 'Random Letter Generator' });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in randomletter command:', error);
            await interaction.editReply('An error occurred while processing the command.');
        }
    },
};