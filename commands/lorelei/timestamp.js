//timestamp command
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment-timezone');
const countries = require('countries-and-timezones');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('timestamp')
  .setDescription(
    "Convert your country's date & time to a timestamp (default current time & date)"
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
  )
  .addStringOption((option) =>
    option
      .setName('country')
      .setDescription(
        "Country name (e.g. Japan, this will be hidden so you can't dox)"
      )
      .setRequired(false)
      .setAutocomplete(true)
  );

//country names to country codes
const countryToCode = Object.entries(countries.getAllCountries()).reduce(
  (acc, [code, data]) => {
    acc[data.name.toLowerCase()] = code;
    return acc;
  },
  {}
);

//function to get timezone for a country
function getTimezoneForCountry(country) {
  const countryCode = countryToCode[country];
  if (!countryCode) return null;

  const timezones = countries.getTimezonesForCountry(countryCode);
  return timezones.length > 0 ? timezones[0].name : null;
}

//capitalise the first letter of each word
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

//autocomplete country
const autocomplete = async (interaction) => {
  const focusedOption = interaction.options.getFocused(true);

  if (focusedOption.name === 'country') {
    const focusedValue = focusedOption.value || '';
    const countriesList = Object.keys(countryToCode);
    const filteredCountries = countriesList
      .filter((country) =>
        country.toLowerCase().includes(focusedValue.toLowerCase())
      )
      .slice(0, 25);

    //country options
    await interaction.respond(
      filteredCountries.map((country) => ({
        name: toTitleCase(country),
        value: country,
      }))
    );
  } else if (focusedOption.name === 'date') {
    //autocomplete options for date
    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');

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

    //loop for every 3rd hour
    for (let hour = 0; hour < 24; hour += 3) {
      const timeString = hour.toString().padStart(2, '0') + ':00';
      timeSuggestions.push({ name: timeString, value: timeString });
    }
    await interaction.respond(timeSuggestions);
  }
};

//convert the time
const execute = async (interaction) => {
  try {
    //set the country,date & time as user input
    const date =
      interaction.options.getString('date') || moment().format('YYYY-MM-DD'); //default current date
    const time =
      interaction.options.getString('time') || moment().format('HH:mm'); //default current time
    const country =
      interaction.options.getString('country')?.toLowerCase() || null;

    //validate date, time, & country
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
      //set timezone for country
      const timezone = country
        ? getTimezoneForCountry(country)
        : moment.tz.guess();

      if (!timezone) {
        return interaction.reply({
          content:
            'Invalid country or could not determine timezone! <:nyaAngry:1251302942456414218>',
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
      const defaultDate = !interaction.options.getString('date');
      const defaultTime = !interaction.options.getString('time');
      const defaultCountry = !interaction.options.getString('country');

      //public message
      const publicMessage = `Here's your timestamp: <t:${timestamp}:F>`;

      if (defaultDate && defaultTime && defaultCountry) {
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
