//DESTROY BEEEEEAAM
const { SlashCommandBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('beam')
  .setDescription('Die.');

//prints message
const execute = async (interaction) => {
  await interaction.reply(
    "🫳\n<a:nyaDestroy:1293834836443926560><a:beam1:1293834898875875328><a:beam2:1293834900688080947><a:beam3:1293834902500016242><a:beam4:1293834904093589545><a:beam5:1293834906052591626>\n🫴"
  );
};

module.exports = { data, execute };