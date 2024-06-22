require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const { SE_ENDPOINTS } = require('../../se-endpoints');

const CHANNEL_ID = process.env.CHANNEL_ID;

const data = new SlashCommandBuilder()
  .setName('oinks')
  .setDescription('Checks your oinks')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('Your twitch username')
      .setRequired(true)
  );

const execute = async (interaction) => {
  await interaction.deferReply();
  const name = interaction.options.getString('name');

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    let url = SE_ENDPOINTS.POINTS + `${CHANNEL_ID}/top`;
    let response = await fetch(url, options);
    response = await response.json();
    const total = response._total;
  } catch (err) {
    console.error(err);
    return;
  }

  url = SE_ENDPOINTS.POINTS + `${CHANNEL_ID}/${name}`;

  fetch(url, options)
    .then((response) => response.json())
    .then(async (response) => {
      if (response.error) {
        await interaction.followUp(
          'No such user <:nyaSad:1250106743514599435>\nCheck if you entered your Twitch name correctly!'
        );
      } else {
        const oinks = response.points;
        const rank = response.rank;
        await interaction.followUp(
          `You have ${oinks} oinks! Your rank is ${rank}/${total} on the leaderboard.`
        );
      }
    })
    .catch(async (err) => {
      await interaction.followUp(
        'Something went wrong <:nyaSad:1250106743514599435>'
      );
      console.error(err);
    });
};

module.exports = { data, execute };
