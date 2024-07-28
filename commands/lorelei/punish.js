const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ActionRow,
  ComponentType,
  EmbedBuilder,
} = require('discord.js');
const { chooseWithProbabilities } = require('../../randomUtil.js');

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
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('extreme')
      .setDescription('Only for the worst offenders, use with care.')
      .addUserOption((option) =>
        option
          .setName('target')
          .setDescription('The evil person to punish')
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName('duration')
          .setDescription('Duration of the timeout in seconds (60s default)')
      )
      .addIntegerOption((option) =>
        option
          .setName('time')
          .setDescription(
            'How much time they have to type in seconds (150s default)'
          )
      )
  );

const extremePunish = async (channel, target, duration, timeInSeconds) => {
  const gomens = [
    [
      'Gomenasorry ojousama supreme commander cult leader hime princess nya nya',
      'use the buttons below to type out the full gomenasorry message. Good luck! <:nyaSalute:1251618350736478270>',
    ],
    [
      'Gomenyasorry ojousama supreme commyander cult leader himye princyess nya nya',
      'use the buttons below to type out the full gome*NYA*sorry message. This is a rare variant! Good luck! <:nyaSalute:1251618350736478270>',
    ],
    [
      'sowwy Commyandew, I am simpwy too stupid of a degenyewate t-to undewstand youw shawp wits and amazing tawents!!11',
      'use the buttons below to type out the UWUfied gomenasorry message. This is an ultra rare variant! Good luck! <:nyaSalute:1251618350736478270>',
    ],
  ];

  const choice = chooseWithProbabilities(gomens, [
    [1, 70],
    [71, 90],
    [91, 100],
  ]);
  const [gomen, displayText] = choice;

  let letters = gomen.split('');
  letters = [...new Set(letters)];
  const buttons = [];

  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i];

    if (letter === ' ') letter = 'space';

    const btn = new ButtonBuilder()
      .setCustomId(letter)
      .setLabel(letter.toUpperCase())
      .setStyle(ButtonStyle.Secondary);
    buttons.push(btn);
  }

  const rows = [];

  const chunkSize = 5;
  for (let i = 0; i < buttons.length; i += chunkSize) {
    const chunk = buttons.slice(i, i + chunkSize);
    const row = new ActionRowBuilder().addComponents(...chunk);
    rows.push(row);
  }

  let secondsLeft = timeInSeconds;

  let text = `Hey, ${target}, ${displayText}\nTime left: ${secondsLeft} seconds\n`;

  let embed = new EmbedBuilder()
    .setTitle('Extreme Punish')
    .setColor('Blurple')
    .setDescription(text)
    .setTimestamp();

  const response = await channel.send({
    content: `${target}`,
    embeds: [embed],
    components: [...rows],
  });

  const filter = (i) => i.user.id === target.id;

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: secondsLeft * 1000,
    filter: filter,
  });

  let gomenText = '';

  const updateTime = 5;

  const intervalId = setInterval(async () => {
    secondsLeft -= updateTime;
    text = text.replace(/(\d+)(?= seconds)/, `${secondsLeft}`);
    embed.setDescription(text);
    try {
      await response.edit({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return;
    }
  }, updateTime * 1000);

  const timeoutId = setTimeout(
    () => clearInterval(intervalId),
    (secondsLeft - 1) * 1000
  );

  collector.on('collect', async (i) => {
    gomenText += i.customId === 'space' ? ' ' : i.customId;
    text += i.customId === 'space' ? ' ' : i.customId;
    embed.setDescription(text);
    await i.update({ embeds: [embed] });

    if (!gomen.startsWith(gomenText)) {
      collector.stop('failure');
    }

    if (gomenText === gomen) {
      collector.stop('success');
      await channel.send(
        `Congratulations, ${target}, you live to see another day.`
      );
    }
  });

  collector.on('ignore', async (i) => {
    // when an interaction is ignored
  });

  collector.on('end', async (collected, reason) => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    if (reason !== 'success') {
      if (reason === 'failure') {
        await response.reply(`You messed up, ${target}, delete yourself.`);
      } else {
        await response.reply(`You were too late, ${target}, delete yourself.`);
      }

      if (target.manageable || target.moderatable) {
        await target.timeout(duration, 'Failed to apologize');
      }
    }

    await response.edit({ components: [] });
  });
};

const execute = async (interaction) => {
  const cathId = '133956553505112064';

  const gomen =
    'Gomenasorry ojousama supreme commander cult leader hime princess nya nya';
  const timeout_duration =
    (interaction.options.getInteger('duration') ?? 60) * 1000;
  if (interaction.options.getSubcommand() === 'many') {
    await interaction.deferReply({ ephemeral: false });
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

    // always add cath to the target list as per commander's instructions
    const cath = await interaction.guild.members.fetch(cathId);
    validTargets.push(cath);

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
  } else if (interaction.options.getSubcommand() == 'extreme') {
    await interaction.deferReply({ ephemeral: true });
    const target = interaction.options.getMember('target');
    const timeInSeconds = interaction.options.getInteger('time') ?? 150;
    await extremePunish(
      interaction.channel,
      target,
      timeout_duration,
      timeInSeconds
    );
    await interaction.editReply(
      '<:nyaSalute:1251618350736478270> yes supreme commyander princess hime nya nya'
    );
  }
};

module.exports = { data, execute, extremePunish };
