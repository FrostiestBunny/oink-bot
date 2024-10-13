//truth message command
const canvasGif = require('canvas-gif');
const Canvas = require('canvas');
const path = require('node:path');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('truth')
  .setDescription('speak it')
  .addStringOption((option) =>
    option
      .setName('truth')
      .setDescription('Your truth.')
      .setRequired(true)
  );

//adds user's profile pic to canvas
const execute = async (interaction) => {
  await interaction.deferReply();
  const inputText = interaction.options.getString('input');
  const target = interaction.options.getMember('target');
  const options = {
    fps: 15,
    delay: 0,
    repeat: 0,
    algorithm: 'neuquant',
    optimiser: true,
    quality: 100,
  };

  //gets user's profile pic
  const avatar = await Canvas.loadImage(
    target.displayAvatarURL({ extension: 'png' })
  );

  //creates new gif of user's avatar getting a headpat
  const callBack = async (
    context,
    width,
    height,
    totalFrames,
    currentFrame
  ) => {
    const canvas = Canvas.createCanvas(avatar.width, avatar.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height);

    ctx.fillStyle = 'white'; // Background color
    ctx.fillRect(0, 0, width, height); // Fill the background
    ctx.fillStyle = 'blue'; // Text color
    ctx.font = '40px Arial'; // Font settings

    // Draw the text
    ctx.fillText(inputText, 5, height / 2 + 15); // Center vertically (+15 for better alignment)


    context.globalCompositeOperation = 'destination-over';
  };

  //sends new headpat gif and message
  canvasGif(path.join(__dirname, 'headpat.gif'), callBack, options)
    .then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, { name: 'headpat.gif' });
      return interaction.followUp({
        content: `${interaction.member} is headpatting ${target}!`,
        files: [attachment],
      });
    })
    .catch((error) => {
      console.error(error);
      return interaction.followUp({
        content: 'Something went wrong, whoops. <:nyaSad:1250106743514599435>',
        ephemeral: true,
      });
    });
};

module.exports = { data, execute };
