//temperature conversion command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('temperature')
  .setDescription('Convert temperature between different scales')
  .addNumberOption((option) =>
    option
      .setName('value')
      .setDescription('Temperature value to convert')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('unit')
      .setDescription('Unit of the temperature value')
      .setRequired(true)
      .addChoices(
        { name: 'Celsius', value: 'C' },
        { name: 'Fahrenheit', value: 'F' },
        { name: 'Kelvin', value: 'K' },
        { name: 'Rankine', value: 'R' }
      )
  );

//convert the temperature
const execute = async (interaction) => {
  try {
    //declare variables, get user inputs
    const value = interaction.options.getNumber('value');
    const unit = interaction.options.getString('unit');
    let celsius, fahrenheit, kelvin, rankine;

    //convert units
    switch (unit) {
      case 'C':
        celsius = value;
        fahrenheit = (value * 9) / 5 + 32;
        kelvin = value + 273.15;
        rankine = ((value + 273.15) * 9) / 5;
        break;
      case 'F':
        celsius = ((value - 32) * 5) / 9;
        fahrenheit = value;
        kelvin = ((value - 32) * 5) / 9 + 273.15;
        rankine = value + 459.67;
        break;
      case 'K':
        celsius = value - 273.15;
        fahrenheit = ((value - 273.15) * 9) / 5 + 32;
        kelvin = value;
        rankine = (value * 9) / 5;
        break;
      case 'R':
        celsius = ((value - 491.67) * 5) / 9;
        fahrenheit = value - 459.67;
        kelvin = (value * 5) / 9;
        rankine = value;
        break;
    }

    //make an embed with the conversion
    const embed = new EmbedBuilder()
      .setColor('DarkOrange')
      .setTitle('🔥 Temperature Scales ❄️')
      .setThumbnail(interaction.member.displayAvatarURL())
      .addFields(
        { name: 'Celsius', value: `${celsius.toFixed(2)}°C`, inline: true },
        {
          name: 'Fahrenheit',
          value: `${fahrenheit.toFixed(2)}°F`,
          inline: true,
        },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Kelvin', value: `${kelvin.toFixed(2)}K`, inline: true },
        { name: 'Rankine', value: `${rankine.toFixed(2)}°R`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true }
      );

    //send the conversion
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content:
        'Something went wrong while converting the temperature... <:nyaSad:1250106743514599435>',
      ephemeral: true,
    });
  }
};

module.exports = { data, execute };
