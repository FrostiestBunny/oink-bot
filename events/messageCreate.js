const { Events } = require('discord.js');
const { extremePunish } = require('../commands/lorelei/punish.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // 60s
    const punishDuration = 60 * 1000;

    for (const element of message.client.bannedWords) {
      const word = Object.values(element)[0];
      if (word.test(message.content)) {
        await extremePunish(
          message.channel,
          message.member,
          punishDuration,
          150
        );
      }
    }
  },
};
