import { Client, GatewayIntentBits, Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import 'dotenv/config';
import { getRandomEmoji } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

const activeGames = {};

client.once(Events.ClientReady, () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'test') {
            await interaction.reply(`Hello world !! ${getRandomEmoji()}`);
        }

        if (commandName === 'challenge') {
            const challengerId = interaction.user.id;
            const objectName = interaction.options.getString('object');
            const gameId = interaction.id;

            activeGames[gameId] = {
                id: challengerId,
                objectName,
            };

            const button = new ButtonBuilder()
                .setCustomId(`accept_button_${gameId}`)
                .setLabel('Accept')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            await interaction.reply({
                content: `Rock papers scissors challenge from <@${challengerId}>`,
                components: [row],
            });
        }
    }

    if (interaction.isButton()) {
        const gameId = interaction.customId.replace('accept_button_', '');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`select_choice_${gameId}`)
            .setPlaceholder('Choose your object')
            .addOptions(getShuffledOptions());

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: 'What is your object of choice?',
            components: [row],
        });

        await interaction.message.delete();
    }

    if (interaction.isStringSelectMenu()) {
        const gameId = interaction.customId.replace('select_choice_', '');
        const objectName = interaction.values[0];
        const userId = interaction.user.id;

        if (!activeGames[gameId]) return;

        const result = getResult(activeGames[gameId], {
            id: userId,
            objectName,
        });

        delete activeGames[gameId];

        await interaction.reply({ content: result });

        await interaction.message.edit({
            content: 'Nice choice ' + getRandomEmoji(),
            components: [], // This removes buttons/menus
        });
    }
});

client.login(process.env.DISCORD_TOKEN);