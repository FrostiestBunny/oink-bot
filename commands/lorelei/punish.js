const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('punish')
  .setDescription('Force a disobedient astronyaut to apologize properly.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('one')
      .setDescription('Punish one person.')
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
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('many')
      .setDescription('Punish many people at once')
      .addIntegerOption((option) =>
        option
          .setName('duration')
          .setDescription('Duration of time out in seconds')
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName('target1')
          .setDescription('The evildoer to punish')
          .setRequired(true)
      )
      .addUserOption((option) =>
        option.setName('target2').setDescription('The evildoer to punish')
      )
      .addUserOption((option) =>
        option.setName('target3').setDescription('The evildoer to punish')
      )
      .addUserOption((option) =>
        option.setName('target4').setDescription('The evildoer to punish')
      )
      .addUserOption((option) =>
        option.setName('target5').setDescription('The evildoer to punish')
      )
  );

const execute = async (interaction) => {
  const gomen =
    'Gomenasorry ojousama supreme commander cult leader hime princess nya nya';
  const timeout_duration =
    (interaction.options.getInteger('duration') ?? 60) * 1000;
  await interaction.deferReply({ ephemeral: false });
  if (interaction.options.getSubcommand() === 'many') {
    const targets = [];

    for (let i = 1; i < 6; i++) {
      if (interaction.options.getMember(`target${i}`))
        targets.push(interaction.options.getMember(`target${i}`));
    }

    let punishMessage = 'Hey, ';

    let validTargets = [];

    targets.forEach(async (target) => {
      if (!target.manageable || !target.moderatable) {
        console.log(`Skipping: ${target}`);
      } else {
        validTargets.push(target);
      }
    });

    punishMessage += validTargets.join(', ');
    punishMessage +=
      "! It's time for you to apologize!\n\nYou have one minute to send a proper apology in this channel.\n\nAny other message but the full gomenasorry text will get you timed out!";
    await interaction.followUp(punishMessage);

    const filter = (m) => {
      const targetIds = validTargets.map((t) => t.id);
      if (m.channel.id != interaction.channelId) return false;
      return targetIds.includes(m.member.id);
    };

    let repliedMap = {};

    validTargets.forEach((t) => {
      repliedMap[t.id] = false;
    });

    interaction.channel
      .awaitMessages({
        filter,
        max: validTargets.length,
        time: 60_000,
        errors: ['time'],
      })
      .then(async (collected) => {
        collected.each(async (msg) => {
          repliedMap[msg.member.id] = true;
          console.log(msg);
          if (msg.content.toLowerCase() === gomen.toLowerCase()) {
            await msg.reply(`You're off the hook for now, oinker.`);
          } else {
            await msg.reply(
              `You have failed to apologize. Time for a little timeout.`
            );
            try {
              await msg.member.timeout(timeout_duration, 'Failed to apologize');
            } catch (e) {
              console.log(e);
            }
          }
        });
      })
      .catch(async (collected) => {
        validTargets.forEach(async (t) => {
          if (!repliedMap[t.id]) {
            await interaction.channel.send(
              `You were too late, <@${t.id}>. Get timed out!`
            );
            try {
              await t.timeout(timeout_duration, 'Failed to apologize');
            } catch (e) {
              console.log(e);
            }
          }
        });
      });
  } else if (interaction.options.getSubcommand() === 'one') {
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
  }
};

module.exports = { data, execute };
