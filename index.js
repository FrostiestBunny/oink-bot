require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const {
  ActivityType,
  Client,
  Collection,
  GatewayIntentBits,
} = require('discord.js');

const TOKEN = process.env.TOKEN;
const DEBUG = process.env.DEBUG === 'true' ? true : false;
const DB_PASS = process.env.DB_PASS;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    activities: [{ name: 'you sleep', type: ActivityType.Watching }],
  },
});

client.commands = new Collection();
client.cooldowns = new Collection();

// *** DATABASE STUFF ***
const sequelize = new Sequelize('database', 'admin', DB_PASS, {
  host: 'localhost',
  dialect: 'sqlite',
  logging: DEBUG,
  storage: 'database.sqlite',
});

// CREATE TABLE |discord_id|discord_name|twitch_name
const Twitch = sequelize.define('twitch_name', {
  discord_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  discord_name: Sequelize.STRING,
  twitch_name: Sequelize.STRING,
});

const LPromises = sequelize.define('promise', {
  promise: {
    type: Sequelize.TEXT,
    unique: true,
  },
  fulfilled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

const bannedTable = sequelize.define('regex', {
  regex: {
    type: Sequelize.TEXT,
    unique: true,
  },
  word: Sequelize.STRING,
});

client.twitchDB = Twitch;
client.promiseDB = LPromises;
client.bannedTable = bannedTable;
// *** END OF DATABASE STUFF ***

//load commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

//load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    if (DEBUG) console.log(`Adding one-time event ${event.name} from ${file}`);
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    if (DEBUG) console.log(`Adding event ${event.name} from ${file}`);
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(TOKEN);
