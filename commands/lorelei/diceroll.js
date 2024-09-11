//diceroll command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('diceroll')
  .setDescription('Roll specified sided dice')
  .addIntegerOption((option) =>
    option
      .setName('sides')
      .setDescription('Number of sides on the die')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('quantity')
      .setDescription('Number of dice to roll')
      .setRequired(true)
  );

//roll the dice
const execute = async (interaction) => {
  try {
    //get username as playername
    const playerName = interaction.member.displayName;
    //set variables
    const sides = interaction.options.getInteger('sides');
    const quantity = interaction.options.getInteger('quantity');

    //get diceroll result
    const rollDie = (sides) => {
      return Math.floor(Math.random() * sides) + 1;
    };

    //check for valid numbers
    if (sides <= 0 || quantity <= 0) {
      await interaction.reply(
        'Please enter valid numbers for sides and quantity greater than 0.'
      );
      return;
    }

    //collect results
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
    return interaction.followUp(
      'Something went wrong <:nyaSad:1250106743514599435>'
    );
  }
};

module.exports = { data, execute };
