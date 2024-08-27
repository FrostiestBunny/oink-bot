const { Events } = require('discord.js');
const twitchManager = require('../twitchManager');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    await client.twitchDB.sync();
    await client.promiseDB.sync();
    await client.bannedTable.sync();

    let twitchNamesDB = await client.twitchDB.findAll({
      attributes: ['discord_id', 'twitch_name'],
    });

    let twitchNames = {};

    twitchNamesDB.forEach((e) => {
      twitchNames[e.discord_id] = e.twitch_name;
    });
    twitchManager.updateTwitchNames(twitchNames);

    let bannedWords = await client.bannedTable.findAll({
      attributes: ['regex', 'word'],
    });

    bannedWords = bannedWords.map((w) => {
      return {
        [w.word]: new RegExp(w.regex, 'i'),
      };
    });
    client.bannedWords = bannedWords;

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
