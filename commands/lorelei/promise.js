//promise command, used to show all of Lorelei's promises
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//name of slash command, subcommand, & description
const data = new SlashCommandBuilder()
  .setName('promise')
  .setDescription("Manage Lorelei's promises.")
  .addSubcommand((subcommand) =>
    subcommand.setName('all').setDescription('Display all promises.')
  );

//displays all of the promises
const execute = async (interaction) => {
  if (interaction.options.getSubcommand() === 'all') {
    const promisesPerPage = 5;

    await interaction.deferReply();

    //gets the promises
    const promiseList = await interaction.client.promiseDB.findAll({
      attributes: ['promise'],
    });

    const pages = [];

    //loop to make the promise list
    for (let i = 0; i < promiseList.length; i += promisesPerPage) {
      const page = promiseList.slice(i, i + promisesPerPage);
      pages.push(page);
    }

    const promiseString =
      promiseList.map((p) => `☆ ${p.promise}`).join('\n\n') ||
      'No promises found';

    //embed flair design
    const embed = new EmbedBuilder()
      .setColor('LuminousVividPink')
      .setTitle("Lorelei's Promises")
      .addFields({ name: 'Page 1', value: promiseString });

    return interaction.followUp({ embeds: [embed] });
  }
};

module.exports = { data, execute };
