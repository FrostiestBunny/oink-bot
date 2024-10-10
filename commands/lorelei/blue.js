//blue for blue words? idk
const { SlashCommandBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('blue')
  .setDescription('Blue Truth');

//prints message
const execute = async (interaction) => {
  await interaction.reply(
    "```ini \n aaa ```"
  );
};

module.exports = { data, execute };