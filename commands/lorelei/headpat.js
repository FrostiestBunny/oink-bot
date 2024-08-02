const { request } = require('undici');
const canvasGif = require('canvas-gif');
const Canvas = require('canvas');
const path = require('node:path');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('headpat')
  .setDescription('Headpat a deserving person')
  .addUserOption((option) =>
    option.setName('target').setDescription('The user to headpat')
  );

const execute = async (interaction) => {
  await interaction.deferReply();
  const target = interaction.options.getMember('target');
  const options = {
    fps: 15,
    delay: 0,
    repeat: 0,
    algorithm: 'neuquant',
    optimiser: true,
    quality: 100,
  };

  const avatar = await Canvas.loadImage(
    target.displayAvatarURL({ extension: 'png' })
  );

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
    context.globalCompositeOperation = 'destination-over';
    if (currentFrame % 3 == 0) {
      context.drawImage(canvas, 0, 20, canvas.width, canvas.height + 20);
    } else {
      context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    }
  };

  canvasGif(path.join(__dirname, 'headpat.gif'), callBack, options)
    .then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, { name: 'headpat.gif' });
      return interaction.followUp({ files: [attachment] });
    })
    .catch((error) => {
      console.error(error);
      return interaction.followUp('Something went wrong, whoops.');
    });
};

module.exports = { data, execute };
