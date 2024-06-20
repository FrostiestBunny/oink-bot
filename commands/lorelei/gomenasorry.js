const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('gomenasorry')
  .setDescription('Apologizes properly.');

const execute = async (interaction) => {
  await interaction.reply(
    'Gomenasorry ojousama supreme commander cult leader hime princess nya nya'
  );
};

module.exports = { data, execute };
