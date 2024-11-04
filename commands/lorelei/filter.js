//add word/phrase to oinkbot's banned word list
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

//name of slash commands, subcommands, & descriptions
const data = new SlashCommandBuilder()
  .setName('filter')
  .setDescription('Filter bad words from the server')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Add a new banned word (regex)')
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription(
            'The name of the filter rule (basically the word you want banned)'
          )
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('regex')
          .setDescription(
            'The regex used to filter the word (without the slashes at start and end)'
          )
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('delete')
      .setDescription('Delete a banned word filter.')
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription('Name of the filter')
          .setRequired(true)
      )
  );

//try catch block for subcommands
const execute = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  if (interaction.options.getSubcommand() === 'add') {
    try {
      const name = interaction.options.getString('name');
      const re = interaction.options.getString('regex');

      //add new word & regex to banned word list
      const added = await interaction.client.bannedTable.create({
        regex: re,
        word: name,
      });

      interaction.client.bannedWords.push({
        [added.word]: new RegExp(added.regex, 'i'),
      });

      await interaction.followUp(
        `Added new rule for ${added.word}: ${added.regex}`
      );
      //catch if not a unique word/phrase
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return interaction.followUp('Regex already exists.');
      } else {
        console.error(error);
        return interaction.followUp({
          content: 'Something went wrong. <:nyaSad:1250106743514599435>',
          ephemeral: true,
        });
      }
    }
  } else if (interaction.options.getSubcommand() === 'delete') {
    try {
      const name = interaction.options.getString('name');

      //delete word/phrase from banned word list
      const rowCount = await interaction.client.bannedTable.destroy({
        where: { word: name },
      });

      if (!rowCount) return interaction.followUp('No such filter found.');

      interaction.client.bannedWords = interaction.client.bannedWords.filter(
        (e) => Object.keys(e)[0] != name
      );
      //print deleted word rule
      await interaction.followUp(`Deleted rule for ${name}.`);
    } catch (error) {
      console.error(error);
      return interaction.followUp({
        content: 'Something went wrong... <:nyaSad:1250106743514599435>',
        ephemeral: true,
      });
    }
  }
};

module.exports = { data, execute };
