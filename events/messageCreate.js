const { Events } = require('discord.js');
const { extremePunish } = require('../commands/lorelei/punish.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // mr breast
    const bannedWords = [
      /(m|nn|rn|🇲|Ⓜ️)+(r|🇷|®️)+ +(b|8||}||:||8|ß|ь|🇧|🅱️)+(r|🇷|®️)+(e|3|£|🇪)+(a|4|@|∆|\/-\|\/_\|Д|🇦|🅰️)+(s|5|§|🇸)+(t|7|🇹|✝️)+/i,
    ];
    // 60s
    const punishDuration = 60 * 1000;

    for (const word of bannedWords) {
      if (word.test(message.content)) {
        await extremePunish(message.channel, message.member, punishDuration);
      }
    }
  },
};
