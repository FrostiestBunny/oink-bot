const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('promise')
  .setDescription("Manage Lorelei's promises.")
  .addSubcommand((subcommand) =>
    subcommand.setName('all').setDescription('Display all promises.')
  );

const execute = async (interaction) => {
  if (interaction.options.getSubcommand() === 'all') {
    await interaction.deferReply();

    const promiseList = await interaction.client.promiseDB.findAll({
      attributes: ['promise'],
    });
    const promiseString =
      promiseList.map((p) => `- ${p.promise}`).join('\n') ||
      'No promises found';
    return interaction.followUp(
      `All of Lorelei's promises so far:\n${promiseString}`
    );
  }
};

module.exports = { data, execute };
