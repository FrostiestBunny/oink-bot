const { SlashCommandBuilder } = require('discord.js');
const { chooseWithProbabilities } = require('../../randomUtil.js');

const data = new SlashCommandBuilder()
  .setName('gomenasorry')
  .setDescription('Apologizes properly.');

const execute = async (interaction) => {
  const gomenasorry = [
    'Gomenasorry ojousama supreme commander cult leader hime princess nya nya',
    'Gomenyasorry ojousama supreme commyander cult leader himye princyess nya nya',
    'sowwy Commyandew, I am simpwy too stupid of a degenyewate t-to undewstand youw shawp wits and amazing tawents!!11',
  ];

  const chosen = chooseWithProbabilities(gomenasorry, [
    [1, 70],
    [71, 90],
    [91, 100],
  ]);

  await interaction.reply(chosen);
};

module.exports = { data, execute };
