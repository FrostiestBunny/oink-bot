require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const { SE_ENDPOINTS } = require('../../se-endpoints');
const twitchManager = require('../../twitchManager');

const CHANNEL_ID = process.env.CHANNEL_ID;

const data = new SlashCommandBuilder()
  .setName('oinks')
  .setDescription('Checks your oinks')
  .addStringOption((option) =>
    option.setName('name').setDescription('Your twitch username')
  );

const execute = async (interaction) => {
  await interaction.deferReply();
  let name = interaction.options.getString('name');
  if (!name) {
    name = twitchManager.getTwitchUsername(interaction.member.id);
  }

  let total;
  try {
    const response = await twitchManager.getTopPoints();
    total = response._total;
  } catch (err) {
    console.error(err);
    return;
  }

  try {
    const response = await twitchManager.getUserPoints(name);
    if (response.error) {
      await interaction.followUp(
        'No such user <:nyaSad:1250106743514599435>\nCheck if you entered your Twitch name correctly!'
      );
    } else {
      const [oinks, rank] = [response.points, response.rank];
      await interaction.followUp(
        `You have ${oinks} oinks! Your rank is ${rank}/${total} on the leaderboard.`
      );
    }
  } catch (err) {
    await interaction.followUp(
      'Something went wrong <:nyaSad:1250106743514599435>'
    );
    console.error(err);
  }
};

module.exports = { data, execute };
