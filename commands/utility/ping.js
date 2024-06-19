const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

const execute = async (interaction) => {
  const sent = await interaction.reply({
    content: 'Pinging...',
    fetchReply: true,
  });
  interaction.editReply(
    `Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
    }ms`
  );
};

const cooldown = 5;

module.exports = { data, execute, cooldown };
