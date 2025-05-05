import { SlashCommandBuilder } from 'discord.js';
import { getRPSChoices } from './game.js'; // Import the RPSChoices from game.js
import { capitalize } from './utils.js';

import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Get all choices from game.js
const RPS_CHOICES = getRPSChoices().map(choice => ({
  name: capitalize(choice),
  value: choice.toLowerCase()
}));

const TEST_COMMAND = new SlashCommandBuilder()
  .setName('test')
  .setDescription('Basic command');

const CHALLENGE_COMMAND = new SlashCommandBuilder()
  .setName('challenge')
  .setDescription('Challenge to a match of rock paper scissors')
  .addStringOption(option =>
    option.setName('object')
      .setDescription('Pick your object')
      .setRequired(true)
      .addChoices(...RPS_CHOICES) // Add all choices from game.js
  );

const commands = [TEST_COMMAND, CHALLENGE_COMMAND];

// Register commands with Discord
async function registerCommands() {
  try {
    await client.login(process.env.DISCORD_TOKEN);
    await client.application.commands.set(commands);
    console.log('✅ Commands registered successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
    process.exit(1);
  }
}

registerCommands();
