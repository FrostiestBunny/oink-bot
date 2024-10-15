const { createCanvas, loadImage } = require('canvas');
const path = require('node:path');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const GIFEncoder = require('gifencoder');

// command data
const data = new SlashCommandBuilder()
  .setName('truth')
  .setDescription('speak your truth.')
  .addStringOption(option =>
    option.setName('truth')
      .setDescription('your truth.')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('color')
      .setDescription('choose your text color (red or blue).')
      .addChoices(
        { name: 'red', value: 'red' },
        { name: 'blue', value: '#0ac2ff' },
      )
      .setRequired(false)
  );

// execute function
const execute = async (interaction) => {
  await interaction.deferReply();
  let inputText = interaction.options.getString('truth');
  const chosenColor = interaction.options.getString('color') || 'red'; // default to red

  // limit input to 225 characters
  inputText = inputText.slice(0, 225);

  // load background image
  const bgImage = await loadImage(path.join(__dirname, 'bg.gif'));
  const width = bgImage.width;
  const height = bgImage.height;
  const encoder = new GIFEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0); // no repeat

  // set desired frame rate and delay
  const fps = 40; // change this to desired fps
  const delay = Math.round(1000 / fps);
  encoder.setDelay(delay); // delay between frames in ms
  encoder.setQuality(10); // gif quality (1 = best)

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // format text
  let formattedText = inputText.charAt(0).toUpperCase() + inputText.slice(1);
  if (!/[.!?]$/.test(formattedText)) {
    formattedText += '.';
  }
  formattedText = `"${formattedText}"`;

  // split text into lines without cutting off words
  const linesToDraw = [];
  const maxLineLength = 59;
  let words = formattedText.split(' ');
  let currentLine = '';

  words.forEach(word => {
    if (currentLine.length + word.length + 1 > maxLineLength) {
      linesToDraw.push(currentLine);
      currentLine = word; // start new line
    } else {
      currentLine += (currentLine.length > 0 ? ' ' : '') + word; // add word to current line
    }
  });
  if (currentLine) linesToDraw.push(currentLine); // add last line if any

  let currentLineIndex = 0;

  // create frames
  while (currentLineIndex < linesToDraw.length) {
    const line = linesToDraw[currentLineIndex];

    for (let i = 0; i <= line.length; i++) {
      ctx.drawImage(bgImage, 0, 0); // redraw background for each frame
      ctx.font = '20px Courier New';

      // draw previous lines
      for (let j = 0; j < currentLineIndex; j++) {
        ctx.fillStyle = chosenColor;
        ctx.fillText(linesToDraw[j], 50, 45 + j * 30);
      }

      // draw current line
      let currentY = 45 + currentLineIndex * 30;
      let currentX = 50;

      for (let index = 0; index < i; index++) {
        ctx.fillStyle = chosenColor; // always use the chosen color
        ctx.fillText(line.charAt(index), currentX, currentY);
        currentX += ctx.measureText(line.charAt(index)).width;
      }

      encoder.addFrame(ctx);
    }

    currentLineIndex++;
  }

  // add delay frame after typing all lines
  const delayFrameCount = 200; // ~5 seconds at 40fps
  for (let i = 0; i < delayFrameCount; i++) {
    encoder.addFrame(ctx);
  }

  encoder.finish();
  const buffer = encoder.out.getData();
  const attachment = new AttachmentBuilder(buffer, { name: 'truth.gif' });

  return interaction.followUp({
    content: `${interaction.member}:`,
    files: [attachment],
  });
};

module.exports = { data, execute };
