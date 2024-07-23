const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('gomenasorry')
  .setDescription('Apologizes properly.');

const execute = async (interaction) => {
  const gomenasorry = [
    'Gomenasorry ojousama supreme commander cult leader hime princess nya nya',
    'Gomenyasorry ojousama supreme commyander cult leader himye princyess nya nya',
    'sowwy Commyandew, I am simpwy too stupid of a degenyewate t-to undewstand youw shawp wits and amazing tawents!!11',
  ];

  const chosen = gomenasorry[Math.floor(Math.random() * gomenasorry.length)];

  await interaction.reply(chosen);
};

module.exports = { data, execute };
