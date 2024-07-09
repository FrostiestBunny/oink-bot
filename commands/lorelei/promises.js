const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require('discord.js');

const data = new ContextMenuCommandBuilder()
  .setName('Make Promise')
  .setType(ApplicationCommandType.Message);

const execute = async (interaction) => {
  await interaction.deferReply();
  const { content, member } = interaction.targetMessage;

  if (member.id != '1223661332964970547') {
    return interaction.followUp(
      "You can only create promises from Lorelei's messages <:nyaNerd:1251606395523039303>"
    );
  }

  try {
    const p = await interaction.client.promiseDB.create({
      promise: content,
    });

    return interaction.followUp(`Promise "${p.promise}" added.`);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return interaction.followUp('That promise already exists.');
    }

    return interaction.followUp(
      'Something went wrong <:nyaSad:1250106743514599435>'
    );
  }
};

module.exports = { data, execute };
