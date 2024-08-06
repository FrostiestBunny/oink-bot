// THIS IS TEMPORARY TRUST ME
require('dotenv').config();
const Sequelize = require('sequelize');
const prompt = require('prompt-sync')();

const DB_PASS = process.env.DB_PASS;

const sequelize = new Sequelize('database', 'admin', DB_PASS, {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

// CREATE TABLE |discord_id|discord_name|twitch_name|
const Twitch = sequelize.define('twitch_name', {
  discord_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  discord_name: Sequelize.STRING,
  twitch_name: Sequelize.STRING,
});

console.log('Hi, add some users');

const addUser = async (discord_id, discord_name, twitch_name) => {
  try {
    const added = await Twitch.create({
      discord_id,
      discord_name,
      twitch_name,
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      console.log('this user already exists');
      return;
    }

    console.log('Something went wrong!!!');
    console.log(err);
  }
};

const getUsers = async () => {
  const nameList = await Twitch.findAll();
  const text = nameList
    .map((n) => [n.discord_id, n.discord_name, n.twitch_name].join(', '))
    .join('\n');
  return text;
};

let discord_id, discord_name, twitch_name;
let cont = true;
let answer;
let text;

(async () => {
  await Twitch.sync();
  while (cont) {
    discord_id = prompt('Discord id: ');
    discord_name = prompt('Discord name: ');
    twitch_name = prompt('Twitch name: ');

    try {
      await addUser(discord_id, discord_name, twitch_name);
      console.log(`Successfully added ${discord_name}`);
      text = await getUsers();
      console.log(text);
      answer = prompt('Continue adding? Y/N: ');
      if (answer.toUpperCase() === 'N') cont = false;
    } catch (err) {
      console.log(err);
      break;
    }
  }
})();
