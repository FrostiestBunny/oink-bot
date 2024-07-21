const { Events } = require('discord.js');
const { extremePunish } = require('../commands/lorelei/punish.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // mr breast
    const bannedWords = [/m\W*r\W*b\W*r\W*e\W*a\W*s\W*t/i];
    // 60s
    const punishDuration = 60 * 1000;

    for (const word of bannedWords) {
      if (word.test(message.content)) {
        await extremePunish(message.channel, message.member, punishDuration);
      }
    }
  },
};
