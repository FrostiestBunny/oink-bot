//gomenasorry message commands
const { SlashCommandBuilder } = require('discord.js');
const { chooseWithProbabilities } = require('../../randomUtil.js');

//name of slash command, description, &  variants
const data = new SlashCommandBuilder()
  .setName('gomenasorry')
  .setDescription('Apologizes properly.')
  .addStringOption((option) =>
    option
      .setName('variant')
      .setDescription('The gomenasorry variant')
      .setRequired(true)
      .addChoices(
        { name: 'standard', value: 'standard' },
        { name: 'nya', value: 'nya' },
        { name: 'uwu', value: 'uwu' }
      )
  );

//gomenasorry variant messages
const execute = async (interaction) => {
  const gomenasorry = [
    'Gomenasorry ojousama supreme commander cult leader hime princess nya nya',
    'Gomenyasorry ojousama supreme commyander cult leader himye princyess nya nya',
    'sowwy Commyandew, I am simpwy too stupid of a degenyewate t-to undewstand youw shawp wits and amazing tawents!!11',
  ];

  //selects variant message based on user input
  const variant = interaction.options.getString('variant');

  let chosen;
  if (variant === 'standard') {
    chosen = gomenasorry[0];
  } else if (variant === 'nya') {
    chosen = gomenasorry[1];
  } else if (variant === 'uwu') {
    chosen = gomenasorry[2];
  }

  await interaction.reply(chosen);
};

module.exports = { data, execute };
