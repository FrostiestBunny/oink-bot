const { Events } = require('discord.js');
const { extremePunish } = require('../commands/lorelei/punish.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // mr breast, 500 cigarettes
    // const bannedWords = [
    //   /(m|nn|rn|🇲|Ⓜ️)+(r|🇷|®️)+ +(b|8||}||:||8|ß|ь|🇧|🅱️)+(r|🇷|®️)+(e|3|£|🇪)+(a|4|@|∆|\/-\|\/_\|Д|🇦|🅰️)+(s|5|§|🇸)+(t|7|🇹|✝️)+/i,
    //   /(5|5️⃣)+\s*(0|0️⃣){2,}\s* +\s*(c|€|🇨|©️)+\s*(i|1|!|l|🇮|ℹ️)+\s*(g|9|🇬)+\s*(a|4|@|∆|\/-\\|\/_\\|Д|🇦|🅰️)+\s*(r|🇷|®️)+\s*(e|3|£|🇪)+\s*(t|7|🇹|✝️){2,}\s*(e|3|£|🇪)+\s*(s|5|§|🇸)+/,
    // ];
    // 60s
    const punishDuration = 60 * 1000;

    for (const word of message.client.bannedWords) {
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
