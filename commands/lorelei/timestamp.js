//timestamp command
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment-timezone');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('timestamp')
  .setDescription(
    'Convert your local date & time to a timestamp (default current time & date)'
  )
  .addStringOption((option) =>
    option
      .setName('date')
      .setDescription('Your local date (YYYY-MM-DD format)')
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('time')
      .setDescription('Your local time (HH:mm format)')
      .setRequired(false)
  );

//convert the time
const execute = async (interaction) => {
  try {
    //set the date & time as user input
    const date =
      interaction.options.getString('date') || moment().format('YYYY-MM-DD'); //default current date
    const time =
      interaction.options.getString('time') || moment().format('HH:mm'); //default current time

    //validate date & time
    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return interaction.reply({
        content:
          'Invalid date format. Please use YYYY-MM-DD for date! <:nyaAngry:1251302942456414218>',
        ephemeral: true,
      });
    } else if (!moment(time, 'HH:mm', true).isValid()) {
      return interaction.reply({
        content:
          'Invalid time format. Please use HH:mm for time! <:nyaAngry:1251302942456414218>',
        ephemeral: true,
      });
    } else {
      //combine date & time
      const userDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');

      //convert to a timestamp
      const timestamp = userDateTime.unix();

      //reply with the timestamp
      await interaction.reply(
        `The input date & time locally is: <t:${timestamp}:F>`
      );
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content:
        'Something went wrong while converting the time. <:nyaSad:1250106743514599435>',
      ephemeral: true,
    });
  }
};

module.exports = { data, execute };
