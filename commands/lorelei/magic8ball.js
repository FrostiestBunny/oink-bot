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

//responses, 2D array to seperate bully responses from normal ones
const responses = {
  normal: [
    'Yes!',
    'No!',
    'Maybe? Maybe not...?',
    "I don't know!!",
    'Can you repeat the question? I can't hear you',
    "You're not the boss of me!!",
    'Sure.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Signs point to yes.',
    'I'm getting sleepy, try again.',
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
    'You will explode.',
    'CORN DOGS!',
    'Uppies for you!',
  ],
  bully: [
    'UGHH',
    'nyaFuck you.',
    'I hate you guys.',
    'You guys should just die!',
    "I'm gonna kill you.",
    "Why don't you just give up and die!",
    'Why are you still holding on? Just kill yourself!',
    "You're so dead, you are actually deceased right nyaow.",
    "I'm gonna find you, I'm gonna hunt you down, & I'm gonna kill you.",
    "I am currently operating on the most recent patch. Please read the patch notes for the developer's comments on this. A common complaint users like you have submitted can be easily corrected by ending yourself.",
  ],
};

//ask the 8ball
const execute = async (interaction) => {
  try {
    //get the question from the user
    const question = interaction.options.getString('question');

    //pigpen bully check
    const channel = interaction.channel.id;
    let availableResponses = [];
    if (channel === '1247276527125794867') {
      //use both normal & bully responses in pig-pen
      availableResponses = [...responses.normal, ...responses.bully];
    } else {
      //use only normal responses anywhere else
      availableResponses = responses.normal;
    }

    //get a random response
    const response =
      availableResponses[Math.floor(Math.random() * availableResponses.length)];

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
    await interaction.reply(
      'Something went wrong while consulting the Magic 8-Ball. <:nyaSad:1250106743514599435>'
    );
  }
};

module.exports = { data, execute };
