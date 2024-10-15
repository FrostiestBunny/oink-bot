// temperature conversion command
const { SlashCommandBuilder } = require('discord.js');

//name of slash command & description
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
      .addChoices(
        { name: 'Celsius', value: 'C' },
        { name: 'Fahrenheit', value: 'F' },
        { name: 'Kelvin', value: 'K' }
      ))
  .addStringOption(option =>
    option.setName('to')
      .setDescription('Temperature unit to convert to')
      .setRequired(true)
      .addChoices(
        { name: 'Celsius', value: 'C' },
        { name: 'Fahrenheit', value: 'F' },
        { name: 'Kelvin', value: 'K' }
      ));

const execute = async (interaction) => {
  const value = interaction.options.getNumber('value');
  const from = interaction.options.getString('from');
  const to = interaction.options.getString('to');
  
  let convertedValue;
  let conversionType;

  // conversion logic
  if (from === 'C') {
    if (to === 'F') {
      convertedValue = (value * 9/5) + 32;
      conversionType = 'Celsius to Fahrenheit';
    } else if (to === 'K') {
      convertedValue = value + 273.15;
      conversionType = 'Celsius to Kelvin';
    } else {
      convertedValue = value; // C to C
      conversionType = 'Celsius to Celsius';
    }
  } else if (from === 'F') {
    if (to === 'C') {
      convertedValue = (value - 32) * 5/9;
      conversionType = 'Fahrenheit to Celsius';
    } else if (to === 'K') {
      convertedValue = (value - 32) * 5/9 + 273.15;
      conversionType = 'Fahrenheit to Kelvin';
    } else {
      convertedValue = value; // F to F
      conversionType = 'Fahrenheit to Fahrenheit';
    }
  } else if (from === 'K') {
    if (to === 'C') {
      convertedValue = value - 273.15;
      conversionType = 'Kelvin to Celsius';
    } else if (to === 'F') {
      convertedValue = (value - 273.15) * 9/5 + 32;
      conversionType = 'Kelvin to Fahrenheit';
    } else {
      convertedValue = value; // K to K
      conversionType = 'Kelvin to Kelvin';
    }
  }

  await interaction.reply(`Converted ${value.toFixed(2)}° ${from} to ${convertedValue.toFixed(2)}° ${to}.`);
};

module.exports = { data, execute };
