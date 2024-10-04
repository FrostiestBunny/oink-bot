//timestamp command
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment-timezone');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('timestamp')
  .setDescription(
    "Convert your timezone's date & time to a timestamp (default current time & date)"
  )
  .addStringOption((option) =>
    option
      .setName('timezone')
      .setDescription(
        "Timezone (e.g. Tokyo, this will be hidden so you can't dox)"
      )
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addStringOption((option) =>
    option
      .setName('date')
      .setDescription('Date (YYYY-MM-DD format)')
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addStringOption((option) =>
    option
      .setName('time')
      .setDescription('Time (HH:mm format)')
      .setRequired(false)
      .setAutocomplete(true)
  );

//common timezones
const commonTimezones = [
  'America/Los_Angeles',
  'America/Chicago',
  'America/New_York',
  'America/Mexico_City',
  'America/Lima',
  'America/Sao_Paulo',
  'Europe/Dublin',
  'Europe/Warsaw',
  'Europe/Helsinki',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

//all timezones labels
const allTimezones = moment.tz.names().map((tz) => {
  const city = tz.split('/')[1]?.replace('_', ' ') || tz;
  const abbreviation = moment.tz(tz).format('z');
  const fullName = `${city} (${abbreviation}, ${tz})`;
  return { name: fullName, value: tz };
});

//sort timezones with common on top
const sortedTimezones = [
  ...commonTimezones.map((tz) => {
    const city = tz.split('/')[1]?.replace('_', ' ') || tz;
    const abbreviation = moment.tz(tz).format('z');
    return { name: `${city} (${abbreviation}, ${tz})`, value: tz };
  }),
  ...allTimezones.filter((tz) => !commonTimezones.includes(tz.value)), //remove duplicates
];

//autocomplete options for timezone
const autocomplete = async (interaction) => {
  const focusedOption = interaction.options.getFocused(true);

  if (focusedOption.name === 'timezone') {
    const focusedValue = focusedOption.value || '';

    //filter by city, abbreviation, country name, or timezone name
    const filteredTimezones = sortedTimezones
      .filter((tz) =>
        tz.name.toLowerCase().includes(focusedValue.toLowerCase())
      )
      .slice(0, 25);

    await interaction.respond(
      filteredTimezones.map((tz) => ({
        name: tz.name,
        value: tz.value,
      }))
    );
  } else if (focusedOption.name === 'date') {
    //autocomplete options for date
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');

    //days from 2 to 7
    const daysLaterSuggestions = Array.from({ length: 5 }, (_, i) => {
      const daysLater = moment()
        .add(i + 2, 'days')
        .format('YYYY-MM-DD');
      return { name: `${i + 2} days later`, value: daysLater };
    });

    const dateSuggestions = [
      { name: 'Yesterday', value: yesterday },
      { name: 'Today', value: today },
      { name: 'Tomorrow', value: tomorrow },
      ...daysLaterSuggestions,
      {
        name: '1 week later',
        value: moment().add(7, 'days').format('YYYY-MM-DD'),
      },
    ];

    await interaction.respond(dateSuggestions);
  } else if (focusedOption.name === 'time') {
    //autocomplete options for time
    const timeSuggestions = [];

    //loop for every hour
    for (let hour = 0; hour < 24; hour += 1) {
      const timeString = hour.toString().padStart(2, '0') + ':00';
      timeSuggestions.push({ name: timeString, value: timeString });
    }
    await interaction.respond(timeSuggestions);
  }
};

//convert the time
const execute = async (interaction) => {
  try {
    //set the timezone,date & time as user input
    const timezone =
      interaction.options.getString('timezone') || moment.tz.guess(); //default system timezone
    const date =
      interaction.options.getString('date') || moment().format('YYYY-MM-DD'); //default current date
    const time =
      interaction.options.getString('time') || moment().format('HH:mm'); //default current time

    //validate timezone, date, & time
    if (!moment.tz.zone(timezone)) {
      return interaction.reply({
        content: 'Invalid timezone! <:nyaAngry:1251302942456414218>',
        ephemeral: true,
      });
    } else if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
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
    }

    //combine date, time, & timezone
    const userDateTime = moment.tz(
      `${date} ${time}`,
      'YYYY-MM-DD HH:mm',
      timezone
    );

    //convert to a timestamp
    const timestamp = userDateTime.unix();

    // Check if the user used all default inputs
    const defaultTimezone = !interaction.options.getString('timezone');
    const defaultDate = !interaction.options.getString('date');
    const defaultTime = !interaction.options.getString('time');

    //public message
    const publicMessage = `Here's your timestamp, <@${interaction.user.id}>: <t:${timestamp}:F>`;

    if (defaultTimezone && defaultDate && defaultTime) {
      //print timestamp if no changed variables
      await interaction.reply(publicMessage);
    } else {
      //send ephemeral message first, this is to protect the users country/timezone
      await interaction.reply({
        content: `You can copy & paste this: \`<t:${timestamp}:F>\`\nThis message is invisible to protect you!`,
        ephemeral: true,
      });
      //follow-up message that shows the timestamp publicly
      await interaction.followUp(publicMessage);
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

module.exports = { data, execute, autocomplete };
