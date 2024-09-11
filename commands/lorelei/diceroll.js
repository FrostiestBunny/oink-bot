//diceroll command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('diceroll')
  .setDescription('Roll specified sided dice')
  .addIntegerOption((option) =>
    option
      .setName('sides')
      .setDescription('Number of sides on the die (maximum 100)')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('quantity')
      .setDescription('Number of dice to roll (maximum 100)')
      .setRequired(true)
  );

//roll the dice
const execute = async (interaction) => {
  try {
    //set playername as username
    const playerName = interaction.member.displayName;
    //set variables
    const sides = interaction.options.getInteger('sides');
    const quantity = interaction.options.getInteger('quantity');

    //get diceroll result
    const rollDie = (sides) => {
      return Math.floor(Math.random() * sides) + 1;
    };

    //check for valid numbers, must be at least 3 sided with max of 100 sides
    if (sides <= 3 || sides > 100) {
      await interaction.reply(
        'Please enter a valid number of sides between 3 and 100! <:nyaAngry:1251302942456414218>'
      );
      return;
    }

    //must be more than 0 & less than 100 dice
    if (quantity <= 0 || quantity > 100) {
      await interaction.reply(
        'Please enter a valid number of dice between 1 and 100! <:nyaAngry:1251302942456414218>'
      );
      return;
    }

    //collect results in array
    let results = [];
    for (let i = 0; i < quantity; i++) {
      results.push(rollDie(sides));
    }

    //make an embed with the results
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Dice Roll Results')
      .setDescription(
        `${playerName} rolled ${quantity} ${sides}-sided dice and got: **${results.join(
          ', '
        )}**`
      );

    //print results
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.reply(
      'Something went wrong while rolling the dice. <:nyaSad:1250106743514599435>'
    );
  }
};

module.exports = { data, execute };
