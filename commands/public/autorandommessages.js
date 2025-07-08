import { Client } from 'discord.js';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function setupAutoRandomMessages(client) {
    const channelId = process.env.COMMAND_CHANNEL_ID;
    const interval = 5 * 60 * 1000; // 5 minutes in milliseconds

    async function sendRandomWords() {
        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) {
                console.error('Channel not found');
                return;
            }

            const wordsFilePath = join(__dirname, '..', '..', 'words.txt');
            const fileContent = await fs.readFile(wordsFilePath, 'utf-8');
            const words = fileContent.split('\n').filter(word => word.trim() !== '');

            if (words.length === 0) {
                console.error('No words found in words.txt');
                return;
            }

            // Select 3-5 random words
            const numberOfWords = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
            const selectedWords = [];
            for (let i = 0; i < numberOfWords; i++) {
                const randomIndex = Math.floor(Math.random() * words.length);
                selectedWords.push(words[randomIndex]);
            }

            const message = selectedWords.join(' ');
            await channel.send(message);
        } catch (error) {
            console.error('Error sending random words:', error);
        }
    }

    // Start the interval
    setInterval(sendRandomWords, interval);
    console.log('Auto random messages started. Sending messages every 5 minutes.');
}
