const { SlashCommandBuilder } = require('discord.js');

// Create a slash command with options for temperature conversion
const data = new SlashCommandBuilder()
  .setName('temp')
  .setDescription('Convert temperature between Celsius, Fahrenheit, and Kelvin.')
  .addNumberOption(option =>
    option.setName('value')
      .setDescription('The temperature value to convert')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('from')
      .setDescription('Temperature unit to convert from')
      .setRequired(true)
      .addChoices('Celsius', 'C')
      .addChoices('Fahrenheit', 'F')
      .addChoices('Kelvin', 'K'))
  .addStringOption(option =>
    option.setName('to')
      .setDescription('Temperature unit to convert to')
      .setRequired(true)
      .addChoices('Celsius', 'C')
      .addChoices('Fahrenheit', 'F')
      .addChoices('Kelvin', 'K'));

const execute = async (interaction) => {
  const value = interaction.options.getNumber('value');
  const from = interaction.options.getString('from');
  const to = interaction.options.getString('to');
  
  let convertedValue;

  // Conversion logic
  if (from === 'C') {
    if (to === 'F') {
      convertedValue = (value * 9/5) + 32;
    } else if (to === 'K') {
      convertedValue = value + 273.15;
    } else {
      convertedValue = value; // C to C
    }
  } else if (from === 'F') {
    if (to === 'C') {
      convertedValue = (value - 32) * 5/9;
    } else if (to === 'K') {
      convertedValue = (value - 32) * 5/9 + 273.15;
    } else {
      convertedValue = value; // F to F
    }
  } else if (from === 'K') {
    if (to === 'C') {
      convertedValue = value - 273.15;
    } else if (to === 'F') {
      convertedValue = (value - 273.15) * 9/5 + 32;
    } else {
      convertedValue = value; // K to K
    }
  }

  await interaction.reply(`Converted value: ${convertedValue.toFixed(2)} ${to}`);
};

module.exports = { data, execute };