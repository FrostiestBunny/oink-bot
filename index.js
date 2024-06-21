require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const {
  ActivityType,
  Client,
  Collection,
  GatewayIntentBits,
} = require('discord.js');
const TOKEN = process.env.TOKEN;
const DEBUG = process.env.DEBUG === 'true' ? true : false;

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
