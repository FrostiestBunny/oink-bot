//500 cigarette message command
const { SlashCommandBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('smoke')
  .setDescription('500 cigarettes');

//prints message
const execute = async (interaction) => {
  await interaction.reply('500 cigarettes');
};

module.exports = { data, execute };
