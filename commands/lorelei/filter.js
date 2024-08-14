const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
  );

const execute = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  if (interaction.options.getSubcommand() === 'add') {
    try {
      const name = interaction.options.getString('name');
      const re = interaction.options.getString('regex');

      const added = await interaction.client.bannedTable.create({
        regex: re,
        word: name,
      });

      interaction.client.bannedWords.push(new RegExp(added.regex, 'i'));

      await interaction.followUp(
        `Added new rule for ${added.word}: ${added.regex}`
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return interaction.followUp('Regex already exists.');
      } else {
        console.error(error);
        return interaction.followUp(
          'Something went wrong <:nyaSad:1250106743514599435>'
        );
      }
    }
  }
};

module.exports = { data, execute };
