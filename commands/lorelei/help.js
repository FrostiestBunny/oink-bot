//help command to explain other OinkBot commands - This should be updated with each new command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription("Provides information about OinkBot's commands.");

const execute = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor('Persian Green')
    .setTitle('🐷 OinkBot Command List 🤖')
    .setDescription('Here are the available commands:')
    .addFields(
      {
        name: '🃏 Gambling Commands 🎲',
        value: `
        **/blackjack**\t- Play a game of blackjack with OinkBot.
        **/coinflip**\t- Flip a coin or coins.
        **/diceroll**\t- Roll a die or dice.
        **/magic8ball**\t- Ask a question & get a response.
      `,
      },
      {
        name: '🎉 Fun Commands 🎈',
        value: `
        **/beam**\t- Fire Lorelei's Destroy Beam.
        **/bonk**\t- Makes a gif of a target user getting hit with a mallet.
        **/gomenasorry**\t- Prints some predefined apology notes.
        **/headpat**\t- Makes a gif of a target user getting a headpat.
        **/thank**\t- Prints ~~a thank you message for Lorelei~~ propaganda.
      `,
      },
      {
        name: '🔧 Utility Commands 🕰️',
        value: `
        **/oinks**\t- Displays the target user's oinks (oinks are a Lorelei stream currency).
        **/promise**\t- Displays all of Lorelei's promises.
        **/timestamp**\t- Converts a given time for a city/timezone to a Discord timestamp, which will display in local time for each user.
        **/suggest**\t- Allows a user to send a private suggestion to the mod team.
      `,
      },
      {
        name: '🔨 Mod Tools 🔪',
        value: `
        **/filter**\t- Add a word or phrase for OinkBot to auto-punish.
        **/promises**\t- Makes a new promise out of a Lorelei message.
        **/punish**\t- Gives the target user a time limit to write one of the predefined apologies. Extreme version available.
      `,
      }
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports = { data, execute };
