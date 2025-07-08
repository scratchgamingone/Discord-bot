import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('wikifact')
        .setDescription('Get a random fact from Wikidata'),

    async execute(interaction) {
        await interaction.deferReply();

        const maxRetries = 3;
        let attempts = 0;

        while (attempts < maxRetries) {
            try {
                console.log(`Attempt ${attempts + 1} to fetch Wikidata fact...`);
                
                const randomItemResponse = await fetch('https://www.wikidata.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json');
                const randomItemData = await randomItemResponse.json();
                
                if (!randomItemData.query || !randomItemData.query.random || !randomItemData.query.random[0]) {
                    throw new Error('Failed to fetch a random Wikidata item');
                }

                const itemId = randomItemData.query.random[0].title;
                console.log('Fetched item ID:', itemId);

                const itemDetailsResponse = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${itemId}&format=json&languages=en`);
                const itemDetailsData = await itemDetailsResponse.json();

                if (!itemDetailsData.entities || !itemDetailsData.entities[itemId]) {
                    throw new Error('Failed to fetch item details');
                }

                const entity = itemDetailsData.entities[itemId];
                const label = entity.labels?.en?.value || 'Unknown';
                const description = entity.descriptions?.en?.value || 'No description available';

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Random Wikidata Fact')
                    .addFields(
                        { name: 'Item', value: label, inline: true },
                        { name: 'Description', value: description, inline: true }
                    )
                    .setFooter({ text: `Wikidata ID: ${itemId}` });

                await interaction.editReply({ embeds: [embed] });
                return;

            } catch (error) {
                console.error(`Error on attempt ${attempts + 1}:`, error);
                attempts++;

                if (attempts >= maxRetries) {
                    await interaction.editReply('Sorry, I couldn\'t fetch a Wikidata fact after multiple attempts. Please try again later.');
                    return;
                }
            }
        }
    },
};
