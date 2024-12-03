//magic8ball command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('magic8ball')
  .setDescription('Ask the Magic 8-Ball a question')
  .addStringOption((option) =>
    option
      .setName('question')
      .setDescription('The question you want to ask the Magic 8-Ball')
      .setRequired(true)
  );

//responses
const responses = [
  'Yes!',
  'No!',
  'Maybe? Maybe not...?',
  "I don't know!!",
  "Can you repeat the question? I can't hear you",
  "You're not the boss of me!!",
  'Sure.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Signs point to yes.',
  "I'm getting sleepy, try again.",
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  "Don't count on it, buddy.",
  'My reply is no and will forever be no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.',
  "It's nyaover.",
  'It could work, who knows.',
  'Congratulations!',
  'Stop shaking me!',
  "I'm sorry, but I cannot fulfill this request as it goes against LorelAI use policy.",
  'Look behind you.',
  "OMG that's crazy!",
  'All signs point to skibidi.',
  'Okay buddy.',
  "I don't think so pal.",
  'CORN DOGS!',
  'Uppies for you!',
];

//ask the 8ball
const execute = async (interaction) => {
  try {
    //get the question from the user
    const question = interaction.options.getString('question');

    //get a random response
    const response = responses[Math.floor(Math.random() * responses.length)];

    //make an embed with the response
    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setTitle('Magic 8-Ball')
      .setThumbnail(interaction.member.displayAvatarURL())
      .setDescription(
        `🎱 **Question:** ${question}\n<:baldlei:1254809135480832070> **Answer:** ${response}`
      );

    //send the response
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content:
        'Something went wrong while consulting the Magic 8-Ball... <:nyaSad:1250106743514599435>',
      ephemeral: true,
    });
  }
};

module.exports = { data, execute };
