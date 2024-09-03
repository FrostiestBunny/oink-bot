//promises command, used to add to Lorelei's promises
const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require('discord.js');

//name of slash command & description
const data = new ContextMenuCommandBuilder()
  .setName('Make Promise')
  .setType(ApplicationCommandType.Message);

//get message
const execute = async (interaction) => {
  await interaction.deferReply();
  const { content, member } = interaction.targetMessage;

  //validate message is from Lorelei
  if (member.id != '1223661332964970547' && member.id != '178887072864665600') {
    return interaction.followUp(
      "You can only create promises from Lorelei's messages <:nyaNerd:1251606395523039303>"
    );
  }

  //add message to the promise list
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
