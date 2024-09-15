const { Events, GuildMember } = require('discord.js');
const { extremePunish } = require('../commands/lorelei/punish.js');

/**
 * @typedef Message
 * @type {object}
 * @property {GuildMember} member
 */
module.exports = {
  name: Events.MessageCreate,
  /**
   * @param {Message} message
   */
  async execute(message) {
    try {
      //check if message, member, or bannedWords are invalid, or if the message is from oinkbot
      if (
        !message?.member ||
        message.member.id === process.env.CLIENT_ID ||
        !message.client.bannedWords
      )
        return;

      //60s
      const PUNISH_DURATION = 60 * 1000;

      for (const element of message.client.bannedWords) {
        const word = Object.values(element)[0];
        if (word.test(message.content)) {
          await extremePunish(
            message.channel,
            message.member,
            PUNISH_DURATION,
            150
          );
        }
      }
    } catch (error) {
      console.error('Error in messageCreate event:', error);
    }
  },
};
