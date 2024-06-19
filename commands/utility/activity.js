const { SlashCommandBuilder, ActivityType } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('activity')
  .setDescription('Set activity (developer only)')
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('The type of the activity')
      .setRequired(true)
      .addChoices(
        { name: 'playing', value: 'playing' },
        { name: 'listening to', value: 'listening' },
        { name: 'watching', value: 'watching' },
        { name: 'streaming', value: 'streaming' },
        { name: 'competing in', value: 'competing' }
      )
  )
  .addStringOption((option) =>
    option
      .setName('details')
      .setDescription('The details of the activity')
      .setRequired(true)
  );

const execute = async (interaction) => {
  if (interaction.user.id != '178887072864665600') {
    await interaction.reply({ content: "You're not my dad!", ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  let activity_type = interaction.options.getString('type');
  if (activity_type === 'playing') activity_type = ActivityType.Playing;
  if (activity_type === 'listening') activity_type = ActivityType.Listening;
  if (activity_type === 'watching') activity_type = ActivityType.Watching;
  if (activity_type === 'streaming') activity_type = ActivityType.Streaming;
  if (activity_type === 'competing') activity_type = ActivityType.Competing;

  interaction.client.user.setActivity(
    interaction.options.getString('details'),
    { type: activity_type }
  );

  await interaction.editReply({
    content: 'Activity updated successfully',
    ephemeral: true,
  });
};

module.exports = { data, execute };
