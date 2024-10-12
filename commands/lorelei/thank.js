//thank Lorelei message command
const { SlashCommandBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('thank')
  .setDescription('Only the truth.');

//prints message
const execute = async (interaction) => {
  await interaction.reply(
    "Lorelei's presence in our lives has improved its quality, restored our hairlines, made our crops flourish, and ensured we win every gamble a thousandfold! Accept the Supreme Commyander into your heart now, and join her Space Colony!"
  );
};

module.exports = { data, execute };
