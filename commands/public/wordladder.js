import { SlashCommandBuilder } from 'discord.js';

const wordList = ['cat', 'cot', 'dot', 'dog', 'log', 'lag', 'bag', 'big', 'pig', 'pin', 'pen', 'pan', 'man', 'mat', 'rat', 'hat', 'hot', 'pot', 'put', 'cut', 'cup', 'cap'];

function isValidStep(word1, word2) {
    if (word1.length !== word2.length) return false;
    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) differences++;
    }
    return differences === 1;
}

export const command = new SlashCommandBuilder()
    .setName('wordladder')
    .setDescription('Start a word ladder game')
    .addStringOption(option =>
        option.setName('difficulty')
            .setDescription('Choose the difficulty level')
            .setRequired(true)
            .addChoices(
                { name: 'Easy', value: 'easy' },
                { name: 'Medium', value: 'medium' },
                { name: 'Hard', value: 'hard' }
            ));

export async function execute(interaction) {
    const difficulty = interaction.options.getString('difficulty');
    let steps;
    switch (difficulty) {
        case 'easy':
            steps = 3;
            break;
        case 'medium':
            steps = 5;
            break;
        case 'hard':
            steps = 7;
            break;
    }

    const startWord = wordList[Math.floor(Math.random() * wordList.length)];
    let endWord = startWord;
    while (endWord === startWord || !isValidStep(startWord, endWord)) {
        endWord = wordList[Math.floor(Math.random() * wordList.length)];
    }

    await interaction.reply(`Word Ladder Game (${difficulty}):\nStart word: **${startWord}**\nEnd word: **${endWord}**\n\nCan you transform the start word into the end word in ${steps} steps or less? Each step should change only one letter and be a valid word.\n\nReply with your solution as a comma-separated list of words, including the start and end words. For example: cat,cot,dot,dog`);

    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 300000 }); // 5 minutes

    collector.on('collect', m => {
        const solution = m.content.toLowerCase().split(',');
        if (solution[0] !== startWord || solution[solution.length - 1] !== endWord) {
            m.reply('Your solution must start with the given start word and end with the given end word.');
            return;
        }

        if (solution.length > steps + 1) {
            m.reply(`Your solution takes ${solution.length - 1} steps, but the maximum allowed is ${steps}.`);
            return;
        }

        let valid = true;
        for (let i = 1; i < solution.length; i++) {
            if (!isValidStep(solution[i-1], solution[i]) || !wordList.includes(solution[i])) {
                valid = false;
                break;
            }
        }

        if (valid) {
            m.reply(`Congratulations! You've solved the word ladder in ${solution.length - 1} steps!`);
            collector.stop();
        } else {
            m.reply('Your solution is not valid. Remember, each step should change only one letter and be a valid word.');
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.followUp('Time's up! The word ladder game has ended.');
        }
    });
}