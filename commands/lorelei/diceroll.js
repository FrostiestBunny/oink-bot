//diceroll command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('diceroll')
  .setDescription('Roll specified sided dice')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('basic')
      .setDescription('Roll specified sided dice without a modifier')
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
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('modified')
      .setDescription('Roll specified sided dice with a modifier')
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
      )
      .addIntegerOption((option) =>
        option
          .setName('modifier')
          .setDescription(
            'Modifier to add or subtract from the roll (between -50 and +50)'
          )
          .setRequired(true)
      )
  );

//roll the dice
const execute = async (interaction) => {
  try {
    //set playername as username
    const playerName = interaction.member.displayName;
    //get subcommand
    const subcommand = interaction.options.getSubcommand() || 'basic'; //default basic
    //get variables
    const sides = interaction.options.getInteger('sides') || 20; //default 20
    const quantity = interaction.options.getInteger('quantity') || 1; //default 1

    //get diceroll result
    const rollDie = (sides) => {
      return Math.floor(Math.random() * sides) + 1;
    };

    //check for valid numbers, must be at least 3 sided with max of 100 sides
    if (sides < 3 || sides > 100) {
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

    //instantiate array
    let results = [];

    //basic roll (no modifier)
    if (subcommand === 'basic') {
      for (let i = 0; i < quantity; i++) {
        results.push(rollDie(sides));
      }
    }

    //roll with modifier
    else if (subcommand === 'modified') {
      const modifier = interaction.options.getInteger('modifier');

      //modifier must be between +-50
      if (modifier < -50 || modifier > 50) {
        await interaction.reply(
          'Please enter a modifier between -50 and +50! <:nyaAngry:1251302942456414218>'
        );
        return;
      }

      for (let i = 0; i < quantity; i++) {
        const roll = rollDie(sides);
        const modifiedRoll = roll + modifier;
        results.push(modifiedRoll);
      }
    }

    //make an embed with the results
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Dice Roll Results')
      .setThumbnail(interaction.member.displayAvatarURL())
      .setDescription(
        `${playerName} rolled ${quantity} ${sides}-sided dice and got:\n**${results.join(
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
