const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('thank')
  .setDescription('Only the truth.');

const execute = async (interaction) => {
  await interaction.reply(
    "Lorelei's presence in our lives has improved the quality, restored my hairline, my crops are flourishing, and we win every gamble a thousandfold! Accept the Suprememe Commander into your heart now and join the Space Colony!"
  );
};

module.exports = { data, execute };
