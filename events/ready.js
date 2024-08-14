const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    await client.twitchDB.sync();
    await client.promiseDB.sync();
    await client.bannedTable.sync();

    let bannedWords = await client.bannedTable.findAll({
      attributes: ['regex'],
    });

    bannedWords = bannedWords.map((w) => new RegExp(w.regex, 'i'));
    client.bannedWords = bannedWords;
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
