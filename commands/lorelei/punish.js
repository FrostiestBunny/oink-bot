const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('punish')
  .setDescription('Force a disobedient oinker to apologize properly.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option
      .setName('target')
      .setDescription('The evildoer to punish')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('duration')
      .setDescription('Duration of time out in seconds (60s default)')
  );

const execute = async (interaction) => {
  const timeout_duration =
    (interaction.options.getInteger('duration') ?? 60) * 1000;
  const gomen =
    'Gomenasorry ojousama supreme commander cult leader hime princess nya nya';
  await interaction.deferReply({ ephemeral: true });
  const target = interaction.options.getMember('target');

  if (!target.manageable || !target.moderatable) {
    await interaction.editReply(
      "I don't have permission to timeout this user <:nyaSad:1250106743514599435>"
    );
    return;
  }

  await interaction.channel.send(
    `Hey, <@${target.id}>! It's time for you to apologize!\n\nYou have one minute to send a proper apology in this channel.\n\nAny other message but the full gomenasorry text will get you timed out!`
  );

  const filter = (m) => m.member.id === target.id;
  let replied = false;

  interaction.channel
    .awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] })
    .then(async (collected) => {
      const msg = collected.first();
      replied = true;
      if (msg.content.toLowerCase() === gomen.toLowerCase()) {
        await msg.reply(`You're off the hook for now, oinker.`);
      } else {
        await msg.reply(
          `You have failed to apologize. Time for a little timeout.`
        );
        try {
          await target.timeout(timeout_duration, 'Failed to apologize');
        } catch (e) {
          console.log(e);
        }
      }
    })
    .catch(async (collected) => {
      if (!replied) {
        await interaction.channel.send(
          `You were too late, <@${target.id}>. Get timed out!`
        );
        try {
          await target.timeout(timeout_duration, 'Failed to apologize');
        } catch (e) {
          console.log(e);
        }
      }
    });

  await interaction.editReply("It's done, boss.");
};

module.exports = { data, execute };
