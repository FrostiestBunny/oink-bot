const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    await client.twitchDB.sync();
    await client.promiseDB.sync();
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
