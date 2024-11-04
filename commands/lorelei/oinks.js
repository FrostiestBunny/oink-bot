//oinks command, used to check oinks from Lorelei's twitch
require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const twitchManager = require('../../twitchManager');

const CHANNEL_ID = process.env.CHANNEL_ID;

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('oinks')
  .setDescription('Checks your oinks')
  .addStringOption((option) =>
    option.setName('name').setDescription('Your twitch username')
  );

//get twitch name
const execute = async (interaction) => {
  await interaction.deferReply();
  let name = interaction.options.getString('name');
  if (!name) {
    name = twitchManager.getTwitchUsername(interaction.member.id);
  }

  //get twitch points of user
  let total;
  try {
    const response = await twitchManager.getTopPoints();
    total = response._total;
  } catch (err) {
    console.error(err);
    return;
  }

  //print message of user's points
  try {
    const response = await twitchManager.getUserPoints(name);
    if (response.error) {
      await interaction.followUp({
        content:
          'No such user <:nyaSad:1250106743514599435>\nCheck if you entered your Twitch name correctly!',
        ephemeral: true,
      });
    } else {
      const [oinks, rank] = [response.points, response.rank];
      await interaction.followUp(
        `You have ${oinks} oinks! Your rank is ${rank}/${total} on the leaderboard.`
      );
    }
  } catch (err) {
    await interaction.followUp({
      content: 'Something went wrong, whoops. <:nyaSad:1250106743514599435>',
      ephemeral: true,
    });
    console.error(err);
  }
};

module.exports = { data, execute };
