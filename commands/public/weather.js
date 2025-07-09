
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get current weather information for a city')
        .addStringOption(option =>
            option.setName('state')
                .setDescription('The state (optional, helps with US locations)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('city')
                .setDescription('The city to get weather for')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const city = interaction.options.getString('city');
        const state = interaction.options.getString('state');

        // Create location string
        const location = state ? `${city}, ${state}` : city;

        const fetchWeatherData = async (locationName) => {
            const response = await fetch(`https://wttr.in/${encodeURIComponent(locationName)}?format=j1`);
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        };

        const createWeatherEmbed = (weatherData, locationName) => {
            const current = weatherData.current_condition[0];
            const today = weatherData.weather[0];
            
            return new EmbedBuilder()
                .setColor('#87CEEB')
                .setTitle(`🌤️ Weather in ${locationName}`)
                .setDescription(`**${current.weatherDesc[0].value}**`)
                .addFields(
                    { name: '🌡️ Temperature', value: `${current.temp_C}°C (${current.temp_F}°F)`, inline: true },
                    { name: '💧 Humidity', value: `${current.humidity}%`, inline: true },
                    { name: '💨 Wind Speed', value: `${current.windspeedKmph} km/h`, inline: true },
                    { name: '👁️ Visibility', value: `${current.visibility} km`, inline: true },
                    { name: '🌅 Max Temp Today', value: `${today.maxtempC}°C (${today.maxtempF}°F)`, inline: true },
                    { name: '🌇 Min Temp Today', value: `${today.mintempC}°C (${today.mintempF}°F)`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Powered by wttr.in' });
        };

        try {
            const weatherData = await fetchWeatherData(location);
            const embed = createWeatherEmbed(weatherData, location);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('refresh_weather')
                        .setLabel('Refresh Weather')
                        .setStyle(ButtonStyle.Primary),
                );

            const response = await interaction.editReply({
                embeds: [embed],
                components: [row],
            });

            const collector = response.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'refresh_weather') {
                    await i.deferUpdate();
                    try {
                        const newWeatherData = await fetchWeatherData(location);
                        const newEmbed = createWeatherEmbed(newWeatherData, location);
                        await i.editReply({ embeds: [newEmbed], components: [row] });
                    } catch (error) {
                        await i.editReply({ 
                            content: 'Failed to refresh weather data. Please try again later.',
                            embeds: [],
                            components: [] 
                        });
                    }
                }
            });

            collector.on('end', () => {
                row.components[0].setDisabled(true);
                interaction.editReply({ components: [row] });
            });

        } catch (error) {
            console.error('Error fetching weather:', error);
            await interaction.editReply({ 
                content: `Sorry, I couldn't fetch weather data for "${location}". Please check the location and try again.`,
                ephemeral: true 
            });
        }
    }
};
