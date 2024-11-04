//diceroll command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const numberToWords = require('number-to-words');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('diceroll')
  .setDescription('Roll some dice')
  .addIntegerOption((option) =>
    option
      .setName('sides')
      .setDescription('Number of sides on the die (default 20, maximum 100)')
      .setRequired(false)
  )
  .addIntegerOption((option) =>
    option
      .setName('quantity')
      .setDescription('Number of dice to roll (default 1, maximum 100)')
      .setRequired(false)
  )
  .addIntegerOption((option) =>
    option
      .setName('modifier')
      .setDescription(
        'Modifier to add or subtract from the roll (default 0, between -50 and +50)'
      )
      .setRequired(false)
  );

//roll the dice
const execute = async (interaction) => {
  try {
    //set playername as username
    const playerName = interaction.member.displayName;
    //get variables
    const sides = interaction.options.getInteger('sides') || 20; //default 20
    const quantity = interaction.options.getInteger('quantity') || 1; //default 1
    const modifier = interaction.options.getInteger('modifier') || 0; //default 0

    //get diceroll result
    const rollDie = (sides) => {
      return Math.floor(Math.random() * sides) + 1;
    };

    //check for valid numbers, must be at least 3 sided with max of 100 sides
    if (sides < 3 || sides > 100) {
      await interaction.reply({
        content:
          'Please enter a valid number of sides between 3 and 100! <:nyaAngry:1251302942456414218>',
        ephemeral: true,
      });
      return;
    }

    //must be more than 0 & less than 100 dice
    if (quantity <= 0 || quantity > 100) {
      await interaction.reply({
        content:
          'Please enter a valid number of dice between 1 and 100! <:nyaAngry:1251302942456414218>',
        ephemeral: true,
      });
      return;
    }

    //modifier must be between -50 and +50
    if (modifier < -50 || modifier > 50) {
      await interaction.reply({
        content:
          'Please enter a modifier between -50 and +50! <:nyaAngry:1251302942456414218>',
        ephemeral: true,
      });
      return;
    }

    //instantiate array
    let results = [];

    //roll the dice
    for (let i = 0; i < quantity; i++) {
      const roll = rollDie(sides);
      const modifiedRoll = roll + modifier;
      results.push(modifiedRoll);
    }

    //plural check
    const dieText = quantity === 1 ? 'die' : 'dice';
    const resultText = quantity === 1 ? 'result' : 'results';

    //convert quantity to words
    const quantityWords = numberToWords.toWords(quantity);

    //make an embed with the results
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('🎲 Dice Roll Results 🎲')
      .setThumbnail(interaction.member.displayAvatarURL())
      .setDescription(
        `${playerName} rolled **__${quantityWords}__** **${sides}-sided** ${dieText}${
          modifier !== 0
            ? ` with a modifier of ${modifier >= 0 ? '+' : ''}${modifier}`
            : ''
        } and got the following ${resultText}:\n**${results.join(', ')}**`
      );

    //calculate sum & averages if rolling multiple dice
    if (quantity > 1) {
      //calc sum
      const sum = results.reduce((a, b) => a + b, 0);
      //calc average
      const mean = (sum / results.length).toFixed(2);

      //sort array to get the median value
      const sortedResults = [...results].sort((a, b) => a - b);
      const median =
        sortedResults.length % 2 === 0
          ? (
              (sortedResults[sortedResults.length / 2 - 1] +
                sortedResults[sortedResults.length / 2]) /
              2
            ).toFixed(2)
          : sortedResults[Math.floor(sortedResults.length / 2)];

      //get mode
      const mode = (() => {
        const frequency = {};
        let maxFreq = 0;
        let modes = [];

        //loop to check each value of result & store how frequently the value appears
        for (const num of results) {
          frequency[num] = (frequency[num] || 0) + 1;
          if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            modes = [num];
          } else if (frequency[num] === maxFreq) {
            modes.push(num);
          }
        }
        //if results are equally frequent there is no mode value
        return modes.length === results.length ? 'No mode' : modes.join(', ');
      })();

      //append nyaNerd stats to the embed
      embed.addFields({
        name: 'Overall Results <:nyaNerd:1251606395523039303>',
        value: `Mean: ${mean}, Median: ${median}, Mode: ${mode}, Sum: ${sum}`,
        inline: true,
      });
    }

    //print results
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content:
        'Something went wrong while rolling the dice... <:nyaSad:1250106743514599435>',
      ephemeral: true,
    });
  }
};

module.exports = { data, execute };
