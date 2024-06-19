const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Provides information about the server.');

const execute = async (interaction) => {
  await interaction.reply(
    `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
  );
};

module.exports = { data, execute };
