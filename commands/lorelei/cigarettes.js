const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('smoke')
  .setDescription('500 cigarettes');

const execute = async (interaction) => {
  await interaction.reply('500 cigarettes');
};

module.exports = { data, execute };
