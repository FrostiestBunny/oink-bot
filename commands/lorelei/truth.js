const { createCanvas, loadImage } = require('canvas');
const path = require('node:path');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

// command data
const data = new SlashCommandBuilder()
  .setName('truth')
  .setDescription('Speak your truth.')
  .addStringOption(option =>
    option.setName('truth')
      .setDescription('Your truth.')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('color')
      .setDescription('Choose your text color (red or blue).')
      .addChoices(
        { name: 'red', value: 'red' },
        { name: 'blue', value: '#0ac2ff' },
      )
      .setRequired(false)
  );

// execute function
const execute = async (interaction) => {
  await interaction.deferReply();
  let inputText = interaction.options.getString('truth').slice(0, 225);
  const chosenColor = interaction.options.getString('color') || 'red'; // default to red

  try {
    // load background image (change to a PNG)
    const bgImage = await loadImage(path.join(__dirname, 'bg.gif'));
    const { width, height } = bgImage;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bgImage, 0, 0);

    // format text
    let formattedText = `${inputText.charAt(0).toUpperCase()}${inputText.slice(1)}`;
    if (!/[.!?]$/.test(formattedText)) {
      formattedText += '.';
    }
    formattedText = `"${formattedText}"`;

    // split text into lines without cutting off words
    const linesToDraw = [];
    const maxLineLength = 59;
    let words = formattedText.split(' ');
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 > maxLineLength) {
        linesToDraw.push(currentLine);
        currentLine = word;
      } else {
        currentLine += (currentLine.length > 0 ? ' ' : '') + word; // add word to current line
      }
    }
    if (currentLine) linesToDraw.push(currentLine); // add last line if any

    ctx.font = '20px Courier New';

    // draw each character with specific colors
    let x = 50; 
    let y = 45; 
    const lineHeight = 30;

    linesToDraw.forEach(line => {
      for (const char of line) {
        ctx.fillStyle = /[.,!?;:"“”]/.test(char) ? 'white' : chosenColor;
        ctx.fillText(char, x, y);
        x += ctx.measureText(char).width;
      }
      x = 50;
      y += lineHeight;
    });

    // create PNG buffer
    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'truth.png' });

    return interaction.followUp({
      content: `${interaction.member}:`,
      files: [attachment],
    });

  } catch (error) {
    console.error(error);
    return interaction.followUp({
      content: 'Something went wrong, whoops. <:nyaSad:1250106743514599435>',
      ephemeral: true,
    });
  }
};

module.exports = { data, execute };
